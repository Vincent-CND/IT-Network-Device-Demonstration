import purposeIcon from '../assets/purpose.png'
import targetIcon from '../assets/target.png'
import { homeCards, team } from '../data/content.js'

const icons = { purpose: purposeIcon, target: targetIcon }

export default function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_50%_0%,#12302e_0%,#06151a_55%,#02080a_100%)] px-6 pb-12 pt-14 text-center">
        {/* subtle "server room" grid lines */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(180,227,61,.15)_1px,transparent_1px),linear-gradient(90deg,rgba(180,227,61,.15)_1px,transparent_1px)] [background-size:48px_48px]"
        />
        <div className="relative">
          <h1 className="text-5xl font-bold tracking-wide text-white sm:text-6xl">WELCOME</h1>
          <p className="mt-1 text-2xl font-bold text-white sm:text-3xl">
            TO <span className="text-lime">CYBER QUEST!</span>
          </p>

          <div className="mx-auto mt-10 grid max-w-2xl gap-6 sm:grid-cols-2">
            {homeCards.map(({ key, title, text }) => (
              <article key={key} className="border border-lime bg-panel/95 px-4 py-5">
                <img src={icons[key]} alt="" className="mx-auto h-16 w-16 object-contain" />
                <h2 className="mt-1 text-lg font-semibold text-brand">{title}</h2>
                <p className="mx-auto mt-1 max-w-[14rem] text-xs text-gray-200">{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-3xl px-6 py-14">
        <h2 className="mb-8 text-center text-2xl font-bold tracking-wide">MEET THE TEAM</h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {team.map((member, i) => (
            <figure key={i} className="text-center">
              <div className="border border-lime bg-panel">
                <img
                  src={member.photo}
                  alt={member.name}
                  className="aspect-square w-full object-cover"
                />
              </div>
              <figcaption className="mt-2">
                <p className="text-sm font-semibold">{member.name}</p>
                <p className="text-[11px] font-semibold text-brand">{member.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </>
  )
}
