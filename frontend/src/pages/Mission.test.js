import { fireEvent, render, screen } from '@testing-library/react';
import Mission from './Mission';

const originalFetch = global.fetch;

beforeEach(() => {
  global.fetch = jest.fn().mockImplementation(async (url) => ({
    ok: true,
    json: async () => ({ message: `Backend instruction ${url.split('/').pop()}` }),
  }));
  jest.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  jest.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

test('displays instructions from the backend', async () => {
  render(<Mission setCurrentPage={jest.fn()} />);
  expect(screen.getByText('Loading Mission Data...')).toBeInTheDocument();

  for (const id of [1, 2, 3, 4, 5]) {
    fireEvent.click(await screen.findByRole('button', { name: `Step ${id}` }));
    expect(screen.getByText(`Backend instruction ${id}`)).toBeInTheDocument();
  }
});

test.each([
  ['network failure', () => Promise.reject(new Error('Failed to fetch'))],
  ['HTTP failure', async () => ({ ok: false, status: 500 })],
  ['invalid JSON', async () => ({ ok: true, json: async () => { throw new SyntaxError('Invalid JSON'); } })],
  ...[null, {}, { message: '' }, { message: '   ' }, { message: 123 }, { message: 'There are no more steps' }]
    .map((data) => [JSON.stringify(data), async () => ({ ok: true, json: async () => data })]),
])('shows an error without fallback steps for %s', async (_, response) => {
  global.fetch.mockImplementationOnce(response);
  render(<Mission setCurrentPage={jest.fn()} />);

  expect(await screen.findByRole('alert')).toHaveTextContent('Unable to load mission steps');
  expect(screen.queryByRole('button', { name: 'Step 1' })).not.toBeInTheDocument();
  expect(screen.queryByText('Loading Mission Data...')).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
  expect(await screen.findByRole('button', { name: 'Step 1' })).toBeInTheDocument();
  expect(screen.queryByRole('alert')).not.toBeInTheDocument();
});

test('aborts pending requests when leaving the page', () => {
  global.fetch.mockImplementation(() => new Promise(() => {}));
  const { unmount } = render(<Mission setCurrentPage={jest.fn()} />);
  const signals = global.fetch.mock.calls.map(([, options]) => options.signal);

  unmount();

  expect(signals).toHaveLength(5);
  expect(signals.every((signal) => signal.aborted)).toBe(true);
});
