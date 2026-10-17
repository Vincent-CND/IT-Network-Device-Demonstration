
import React, { useState, useEffect, useRef } from "react";
import logoImg from "../assets/game-logo.png";

// API base URL
const API_URL = "http://localhost:3000";

// Matrix digital rain background
function MatrixBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops = [];

    const fontSize = 16;
    const characters = "01アイウエオカキクケコサシスセソ";

    function resizeCanvas() {
      const ratio = window.devicePixelRatio || 1;

      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * ratio;
      canvas.height = height * ratio;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

      columns = Math.ceil(width / fontSize);
      drops = Array.from(
        { length: columns },
        () => Math.random() * (height / fontSize)
      );
    }

    function draw() {
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const character =
          characters[Math.floor(Math.random() * characters.length)];

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillStyle = "#00ff66";
        ctx.fillText(character, x, y);

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        } else {
          drops[i]++;
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    resizeCanvas();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 opacity-30"
    />
  );
}

// Supports common API response formats
function getQuestionData(response) {
  if (response?.data?.question) {
    return response.data;
  }

  if (response?.question) {
    return response;
  }

  if (response?.message) {
    return {
      question: response.message,
      hint: "",
    };
  }

  return {
    question: "Question data is unavailable.",
    hint: "",
  };
}

function getHintText(response) {
  if (typeof response?.data === "string") {
    return response.data;
  }

  return (
    response?.data?.hint ||
    response?.hint ||
    response?.message ||
    "No hint is available."
  );
}

export default function Game() {
  const [steps, setSteps] = useState(["", "", "", "", ""]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(["", "", "", "", ""]);
  const [hints, setHints] = useState(["", "", "", "", ""]);

  const [activeQuestion, setActiveQuestion] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hintLoading, setHintLoading] = useState(false);

  // Load steps and questions from the backend
  useEffect(() => {
    let cancelled = false;

    async function loadGame() {
      setLoading(true);
      setError("");

      try {
        // GET /step/1
        const response1 = await fetch(`${API_URL}/step/1`);
        if (!response1.ok) {
          throw new Error(`Step 1 API error: ${response1.status}`);
        }
        const stepData1 = await response1.json();

        // GET /step/2
        const response2 = await fetch(`${API_URL}/step/2`);
        if (!response2.ok) {
          throw new Error(`Step 2 API error: ${response2.status}`);
        }
        const stepData2 = await response2.json();

        // GET /step/3
        const response3 = await fetch(`${API_URL}/step/3`);
        if (!response3.ok) {
          throw new Error(`Step 3 API error: ${response3.status}`);
        }
        const stepData3 = await response3.json();

        // GET /step/4
        const response4 = await fetch(`${API_URL}/step/4`);
        if (!response4.ok) {
          throw new Error(`Step 4 API error: ${response4.status}`);
        }
        const stepData4 = await response4.json();

        // GET /step/5
        const response5 = await fetch(`${API_URL}/step/5`);
        if (!response5.ok) {
          throw new Error(`Step 5 API error: ${response5.status}`);
        }
        const stepData5 = await response5.json();

        // GET /question/1
        const questionResponse1 = await fetch(`${API_URL}/question/1`);
        if (!questionResponse1.ok) {
          throw new Error(`Question 1 API error: ${questionResponse1.status}`);
        }
        const questionData1 = await questionResponse1.json();

        // GET /question/2
        const questionResponse2 = await fetch(`${API_URL}/question/2`);
        if (!questionResponse2.ok) {
          throw new Error(`Question 2 API error: ${questionResponse2.status}`);
        }
        const questionData2 = await questionResponse2.json();

        // GET /question/3
        const questionResponse3 = await fetch(`${API_URL}/question/3`);
        if (!questionResponse3.ok) {
          throw new Error(`Question 3 API error: ${questionResponse3.status}`);
        }
        const questionData3 = await questionResponse3.json();

        // GET /question/4
        const questionResponse4 = await fetch(`${API_URL}/question/4`);
        if (!questionResponse4.ok) {
          throw new Error(`Question 4 API error: ${questionResponse4.status}`);
        }
        const questionData4 = await questionResponse4.json();

        // GET /question/5
        const questionResponse5 = await fetch(`${API_URL}/question/5`);
        if (!questionResponse5.ok) {
          throw new Error(`Question 5 API error: ${questionResponse5.status}`);
        }
        const questionData5 = await questionResponse5.json();

        if (cancelled) return;

        setSteps([
          stepData1.message || "",
          stepData2.message || "",
          stepData3.message || "",
          stepData4.message || "",
          stepData5.message || "",
        ]);

        setQuestions([
          getQuestionData(questionData1),
          getQuestionData(questionData2),
          getQuestionData(questionData3),
          getQuestionData(questionData4),
          getQuestionData(questionData5),
        ]);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Could not load game data."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGame();

    return () => {
      cancelled = true;
    };
  }, []);

  // Load the hint for the currently selected question
  async function handleShowHint() {
    setShowHint(true);
    setHintLoading(true);
    setError("");

    try {
      let hintResponse;

      if (activeQuestion === 0) {
        // GET /get/hint/1
        const response = await fetch(`${API_URL}/get/hint/1`);
        if (!response.ok) throw new Error(`Hint API error: ${response.status}`);
        hintResponse = await response.json();
      } else if (activeQuestion === 1) {
        // GET /get/hint/2
        const response = await fetch(`${API_URL}/get/hint/2`);
        if (!response.ok) throw new Error(`Hint API error: ${response.status}`);
        hintResponse = await response.json();
      } else if (activeQuestion === 2) {
        // GET /get/hint/3
        const response = await fetch(`${API_URL}/get/hint/3`);
        if (!response.ok) throw new Error(`Hint API error: ${response.status}`);
        hintResponse = await response.json();
      } else if (activeQuestion === 3) {
        // GET /get/hint/4
        const response = await fetch(`${API_URL}/get/hint/4`);
        if (!response.ok) throw new Error(`Hint API error: ${response.status}`);
        hintResponse = await response.json();
      } else if (activeQuestion === 4) {
        // GET /get/hint/5
        const response = await fetch(`${API_URL}/get/hint/5`);
        if (!response.ok) throw new Error(`Hint API error: ${response.status}`);
        hintResponse = await response.json();
      }

      const hintText = getHintText(hintResponse);

      setHints((previous) =>
        previous.map((value, index) =>
          index === activeQuestion ? hintText : value
        )
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not load the hint."
      );
    } finally {
      setHintLoading(false);
    }
  }

  // Submit an answer to POST /answer
  async function handleSubmitAnswer(event) {
    event.preventDefault();

    const currentAnswer = answers[activeQuestion].trim();

    if (!currentAnswer || submitting) return;

    setSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId: activeQuestion + 1,
          answer: currentAnswer,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `Answer API error: ${response.status}`);
      }

      const isCorrect =
        result.success === true ||
        result.correct === true ||
        result.isCorrect === true;

      if (!isCorrect) {
        setError(result.message || "Incorrect answer. Try again!");
        return;
      }

      const nextCompleted = completedQuestions.includes(activeQuestion)
        ? completedQuestions
        : [...completedQuestions, activeQuestion];

      setCompletedQuestions(nextCompleted);

      if (nextCompleted.length === 5) {
        setShowCongrats(true);
      } else if (activeQuestion < 4) {
        setActiveQuestion(activeQuestion + 1);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not submit your answer."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function handleAnswerChange(value) {
    setAnswers((previous) =>
      previous.map((answer, index) =>
        index === activeQuestion ? value : answer
      )
    );
  }

  const currentQuestion = questions[activeQuestion];
  const progress = (completedQuestions.length / 5) * 100;

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-green-300">
      <MatrixBackground />

      <main className="relative z-10 mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 lg:py-10">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-green-500/30 pb-5">
          <div className="flex items-center gap-3">
            <img
              src={logoImg}
              alt="Cyber Quest logo"
              className="h-12 w-12 object-contain"
            />
            <div>
              <h1 className="text-2xl font-black tracking-widest text-green-400 sm:text-3xl">
                CYBER QUEST
              </h1>
              <p className="text-xs tracking-wider text-green-700">
                MISSION: SAVE YOUR WORLD
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-green-500/40 bg-green-950/50 px-4 py-2 text-sm">
            <span className="text-green-600">MISSIONS SOLVED: </span>
            <span className="font-bold text-green-300">
              {completedQuestions.length}/5
            </span>
          </div>
        </header>

        {/* Loading */}
        {loading && (
          <div className="rounded-xl border border-green-500/30 bg-black/80 p-8 text-center">
            <div className="mb-3 animate-pulse text-xl font-bold text-green-400">
              INITIALIZING MISSION...
            </div>
            <p className="text-sm text-green-700">
              Connecting to the game server.
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div
            role="alert"
            className="mb-6 rounded-lg border border-red-500/50 bg-red-950/70 p-4 text-sm text-red-300"
          >
            <p className="font-bold">SYSTEM MESSAGE</p>
            <p className="mt-1">{error}</p>
            <button
              type="button"
              onClick={() => setError("")}
              className="mt-3 rounded border border-red-500/40 px-3 py-1 hover:bg-red-900"
            >
              Dismiss
            </button>
          </div>
        )}

        {!loading && (
          <>
            {/* Story / Steps */}
            <section className="mb-8 rounded-xl border border-green-500/40 bg-black/80 p-5 shadow-lg shadow-green-950/40 sm:p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border border-green-400 bg-green-950 text-2xl">
                  ⚠
                </div>
                <div>
                  <p className="text-xs font-bold tracking-[0.2em] text-green-700">
                    INCOMING TRANSMISSION
                  </p>
                  <h2 className="text-xl font-black text-green-300 sm:text-2xl">
                    YOUR WORLD NEEDS YOU
                  </h2>
                </div>
              </div>

              <div className="space-y-3">
                {steps.map((step, index) => (
                  <div
                    key={index}
                    className="flex gap-3 rounded-lg border border-green-900/70 bg-green-950/20 p-3"
                  >
                    <span className="shrink-0 font-bold text-green-500">
                      0{index + 1}
                    </span>
                    <p className="text-sm leading-6 text-green-200">
                      {step || "No instructions available for this step."}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Progress */}
            <section className="mb-8">
              <div className="mb-2 flex items-center justify-between text-xs font-bold tracking-wider">
                <span className="text-green-500">MISSION PROGRESS</span>
                <span className="text-green-300">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="h-3 overflow-hidden rounded-full border border-green-900 bg-green-950">
                <div
                  className="h-full bg-green-400 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </section>

            {/* Robot / mission intro */}
            <section className="mb-8 flex items-start gap-4 rounded-xl border border-green-500/30 bg-black/80 p-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl border border-green-500/40 bg-green-950/70 text-3xl">
                🤖
              </div>
              <div>
                <h2 className="mb-2 font-black tracking-wider text-green-400">
                  BOT-X // MISSION ASSISTANT
                </h2>
                <p className="text-sm leading-6 text-green-200">
                  Your world has been taken by the enemy. Explore the two
                  equipment boxes, identify the correct network components,
                  solve all five challenges, and find a way to save your world.
                </p>
              </div>
            </section>

            {/* Questions */}
            <section className="mb-8">
              <div className="mb-5">
                <p className="text-xs font-bold tracking-[0.2em] text-green-700">
                  OBJECTIVE DATABASE
                </p>
                <h2 className="mt-1 text-2xl font-black text-green-400">
                  MISSION CHALLENGES
                </h2>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                {questions.map((question, index) => {
                  const completed = completedQuestions.includes(index);
                  const active = activeQuestion === index;

                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        if (completed || index === 0 ||
                            completedQuestions.includes(index - 1)) {
                          setActiveQuestion(index);
                          setError("");
                        }
                      }}
                      disabled={
                        !completed &&
                        index !== 0 &&
                        !completedQuestions.includes(index - 1)
                      }
                      className={`min-h-28 rounded-xl border p-4 text-left transition ${
                        completed
                          ? "border-green-400 bg-green-950/70"
                          : active
                          ? "border-green-300 bg-green-900/50 shadow-lg shadow-green-900/30"
                          : "border-green-900 bg-black/70"
                      } disabled:cursor-not-allowed disabled:opacity-40`}
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-xs font-bold tracking-widest text-green-600">
                          QUESTION 0{index + 1}
                        </span>
                        <span>
                          {completed ? "✓" : active ? "●" : "🔒"}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-green-200">
                        {completed
                          ? "MISSION COMPLETE"
                          : active
                          ? "ACTIVE MISSION"
                          : "LOCKED"}
                      </p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Active question */}
            <section className="rounded-xl border border-green-400/50 bg-black/90 p-5 shadow-xl shadow-green-950/40 sm:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <span className="rounded border border-green-500/40 bg-green-950/60 px-3 py-1 text-xs font-bold tracking-widest text-green-400">
                  QUESTION 0{activeQuestion + 1} / 05
                </span>

                {completedQuestions.includes(activeQuestion) && (
                  <span className="text-sm font-bold text-green-400">
                    ✓ SOLVED
                  </span>
                )}
              </div>

              <h2 className="mb-4 text-xl font-black text-green-300 sm:text-2xl">
                {currentQuestion?.question || "Question not available."}
              </h2>

              {currentQuestion?.description && (
                <p className="mb-5 text-sm leading-6 text-green-200">
                  {currentQuestion.description}
                </p>
              )}

              <form onSubmit={handleSubmitAnswer}>
                <label
                  htmlFor="mission-answer"
                  className="mb-2 block text-sm font-bold text-green-500"
                >
                  ENTER YOUR ANSWER
                </label>

                <input
                  id="mission-answer"
                  type="text"
                  value={answers[activeQuestion]}
                  onChange={(event) => handleAnswerChange(event.target.value)}
                  placeholder="Type your answer..."
                  disabled={
                    submitting ||
                    completedQuestions.includes(activeQuestion)
                  }
                  autoComplete="off"
                  className="w-full rounded-lg border border-green-700 bg-black px-4 py-3 text-green-200 outline-none placeholder:text-green-900 focus:border-green-300 focus:ring-1 focus:ring-green-400 disabled:opacity-60"
                />

                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={handleShowHint}
                    disabled={hintLoading}
                    className="rounded-lg border border-yellow-500/60 px-5 py-3 text-sm font-bold text-yellow-300 transition hover:bg-yellow-950/50 disabled:opacity-50"
                  >
                    {hintLoading ? "LOADING HINT..." : "💡 GET HINT"}
                  </button>

                  <button
                    type="submit"
                    disabled={
                      submitting ||
                      !answers[activeQuestion].trim() ||
                      completedQuestions.includes(activeQuestion)
                    }
                    className="rounded-lg border border-green-400 bg-green-700/30 px-6 py-3 text-sm font-black tracking-wider text-green-200 transition hover:bg-green-600/40 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {submitting ? "CHECKING..." : "SUBMIT ANSWER →"}
                  </button>
                </div>
              </form>

              {/* Hint */}
              {showHint && (
                <div className="mt-6 rounded-lg border border-yellow-500/40 bg-yellow-950/20 p-4">
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <h3 className="font-bold text-yellow-300">
                      BOT-X HINT
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowHint(false)}
                      className="text-sm text-yellow-600 hover:text-yellow-300"
                    >
                      Close ✕
                    </button>
                  </div>

                  <p className="text-sm leading-6 text-yellow-100">
                    {hintLoading
                      ? "Retrieving hint from the server..."
                      : hints[activeQuestion] ||
                        currentQuestion?.hint ||
                        "No hint returned by the server."}
                  </p>
                </div>
              )}
            </section>

            {/* Footer */}
            <footer className="mt-8 border-t border-green-900 py-5 text-center">
              <p className="text-xs tracking-widest text-green-800">
                CYBER QUEST // SYSTEM ONLINE // SAVE YOUR WORLD
              </p>
            </footer>
          </>
        )}
      </main>

      {/* Victory modal */}
      {showCongrats && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="victory-title"
        >
          <div className="w-full max-w-lg rounded-2xl border-2 border-green-400 bg-black p-8 text-center shadow-2xl shadow-green-900/50">
            <div className="mb-4 text-6xl">🏆</div>
            <h2
              id="victory-title"
              className="mb-4 text-3xl font-black tracking-wider text-green-300"
            >
              WORLD SAVED!
            </h2>
            <p className="mb-6 leading-7 text-green-200">
              Congratulations! You solved all five challenges and completed
              your mission.
            </p>
            <button
              type="button"
              onClick={() => setShowCongrats(false)}
              className="rounded-lg border border-green-400 bg-green-800/40 px-6 py-3 font-bold text-green-200 hover:bg-green-700/60"
            >
              CONTINUE
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
