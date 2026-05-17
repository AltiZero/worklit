"use client";

import { CSSProperties, FormEvent, useEffect, useMemo, useRef, useState } from "react";

import { submitWaitlistSignup } from "@/app/actions/waitlist";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Step = 0 | 1 | 2 | 3;
type Direction = "forward" | "backward";
type TransitionState = "entering" | "leaving";

const CONFETTI_PIECES = [
  ["-132px", "-82px", "-24deg", "0ms", "var(--bg-card)"],
  ["-96px", "-126px", "18deg", "35ms", "var(--green-mid)"],
  ["-58px", "-92px", "62deg", "70ms", "var(--green-light)"],
  ["-20px", "-132px", "-42deg", "15ms", "var(--bg-card)"],
  ["28px", "-112px", "32deg", "50ms", "var(--green-mid)"],
  ["72px", "-130px", "-18deg", "90ms", "var(--green-light)"],
  ["118px", "-82px", "52deg", "30ms", "var(--bg-card)"],
  ["132px", "-22px", "-54deg", "75ms", "var(--green-mid)"],
  ["92px", "40px", "26deg", "110ms", "var(--green-light)"],
  ["48px", "92px", "-36deg", "45ms", "var(--bg-card)"],
  ["4px", "118px", "44deg", "100ms", "var(--green-mid)"],
  ["-48px", "96px", "-12deg", "65ms", "var(--green-light)"],
  ["-104px", "54px", "36deg", "25ms", "var(--bg-card)"],
  ["-132px", "6px", "-62deg", "85ms", "var(--green-mid)"],
] as const;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function WaitlistForm() {
  const [step, setStep] = useState<Step>(0);
  const [direction, setDirection] = useState<Direction>("forward");
  const [transitionState, setTransitionState] = useState<TransitionState>("entering");
  const [email, setEmail] = useState("");
  const [fieldOfWork, setFieldOfWork] = useState("");
  const [biggestPain, setBiggestPain] = useState("");
  const [emailError, setEmailError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const transitionTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeInputRef = useRef<HTMLInputElement | null>(null);

  const totalSteps = 3;
  const currentStep = Math.min(step + 1, totalSteps);

  const progressLabel = useMemo(() => {
    if (step === 3) return "All set";
    return `Step ${currentStep} of ${totalSteps}`;
  }, [currentStep, step]);

  useEffect(() => {
    return () => {
      if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    };
  }, []);

  useEffect(() => {
    if (transitionState !== "entering" || step === 3) return;
    const focusTimeout = setTimeout(() => {
      activeInputRef.current?.focus({ preventScroll: true });
    }, 120);
    return () => clearTimeout(focusTimeout);
  }, [step, transitionState]);

  const changeStep = (nextStep: Step, nextDirection: Direction) => {
    if (transitionTimeout.current) clearTimeout(transitionTimeout.current);
    setDirection(nextDirection);
    setTransitionState("leaving");
    transitionTimeout.current = setTimeout(() => {
      setStep(nextStep);
      setTransitionState("entering");
      transitionTimeout.current = null;
    }, 170);
  };

  const saveSignup = async (data: { fieldOfWork?: string; biggestPain?: string }) => {
    setIsSubmitting(true);
    setSubmitError("");
    const result = await submitWaitlistSignup({ email, ...data });
    setIsSubmitting(false);
    if (!result.ok) {
      setSubmitError(result.message);
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    if (step === 0) {
      if (!isValidEmail(email.trim())) {
        setEmailError("Enter a valid email to continue.");
        return;
      }
      setEmailError("");
      const saved = await saveSignup({});
      if (!saved) return;
      changeStep(1, "forward");
      return;
    }

    if (step === 1) {
      const saved = await saveSignup({ fieldOfWork });
      if (!saved) return;
      changeStep(2, "forward");
      return;
    }

    if (step === 2) {
      const saved = await saveSignup({ fieldOfWork, biggestPain });
      if (!saved) return;
      changeStep(3, "forward");
    }
  };

  const goBack = () => {
    if (step === 0 || step === 3 || isSubmitting) return;
    setSubmitError("");
    changeStep((step - 1) as Step, "backward");
  };

  const panelAnimation =
    transitionState === "leaving"
      ? direction === "forward"
        ? "animate-[waitlistLeaveForward_170ms_cubic-bezier(0.4,0,1,1)_both]"
        : "animate-[waitlistLeaveBackward_170ms_cubic-bezier(0.4,0,1,1)_both]"
      : direction === "forward"
        ? "animate-[waitlistEnterForward_360ms_cubic-bezier(0.16,1,0.3,1)_both]"
        : "animate-[waitlistEnterBackward_360ms_cubic-bezier(0.16,1,0.3,1)_both]";

  return (
    <div
      className={cn(
        "relative isolate flex h-[344px] w-full overflow-hidden rounded-[var(--radius-lg)] border px-8 py-7 shadow-[var(--shadow-lg)] transition-[background,border-color,box-shadow] duration-[520ms] ease-[cubic-bezier(0.16,1,0.3,1)] max-[600px]:p-6",
        step === 3
          ? "items-center justify-center border-green bg-bg-card shadow-[0_18px_50px_oklch(48%_0.120_148_/_0.14),0_4px_12px_oklch(22%_0.014_60_/_0.05)]"
          : "flex-col gap-5 border-border bg-bg-card",
      )}
    >
      {step === 3 ? (
        <>
          <div className="absolute top-1/2 left-1/2 z-0 size-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green animate-[successSpread_1100ms_cubic-bezier(0.16,1,0.3,1)_forwards]" />
          <div className="pointer-events-none absolute inset-0 z-20" aria-hidden="true">
            {CONFETTI_PIECES.map(([x, y, rotate, delay, color], index) => (
              <span
                key={`${x}-${y}-${index}`}
                className="absolute top-1/2 left-1/2 block h-2.5 w-1.5 rounded-[2px] opacity-0 -translate-x-1/2 -translate-y-1/2 scale-[0.6] rotate-0 animate-[confettiBurst_1040ms_cubic-bezier(0.16,1,0.3,1)_var(--confetti-delay)_both]"
                style={
                  {
                    "--confetti-x": x,
                    "--confetti-y": y,
                    "--confetti-rotate": rotate,
                    "--confetti-delay": delay,
                    "--confetti-color": color,
                    background: color,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </>
      ) : null}

      {step !== 3 ? (
        <div className="flex items-start justify-between gap-5">
          <div className="flex flex-col gap-1.5">
            <div className="text-[11px] font-semibold tracking-[0.12em] text-green uppercase">{progressLabel}</div>
            <div className="max-w-[250px] text-[13px] leading-[1.5] text-text-soft">A few quick questions for early access.</div>
          </div>
          <div className="inline-flex items-center gap-1.5 pt-0.5" aria-hidden="true">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={cn(
                  "size-2 rounded-full transition-[background,transform] duration-[180ms]",
                  index <= step ? "scale-[1.04] bg-green" : "bg-border-mid",
                )}
              />
            ))}
          </div>
        </div>
      ) : null}

      <div className={cn("relative z-10 w-full", step === 3 ? "h-full" : "h-[222px] max-[600px]:h-[230px]")}>
        <div className={cn("absolute inset-0 will-change-[opacity,transform,filter]", transitionState === "leaving" && "pointer-events-none", panelAnimation)}>
          {step === 0 ? (
            <form className="grid h-[222px] grid-rows-[72px_auto_46px] gap-4 max-[600px]:h-[230px]" onSubmit={handleSubmit}>
              <div className="flex min-h-[72px] flex-col gap-2">
                <div className="text-[11px] font-semibold tracking-[0.1em] text-text-soft uppercase">Early access</div>
                <div className="max-w-[330px] font-heading text-[32px] leading-[1.08] tracking-[-0.02em] text-text">Start with your email.</div>
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  autoComplete="email"
                  className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[15px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-3 focus-visible:ring-[oklch(48%_0.120_148_/_0.10)]"
                  name="email"
                  placeholder="your@email.com"
                  ref={activeInputRef}
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (emailError) setEmailError("");
                    if (submitError) setSubmitError("");
                  }}
                />
                <div className="min-h-[18px] text-xs leading-[1.5] text-text-soft">{emailError || submitError || "No credit card. No spam."}</div>
              </div>

              <Button className="w-full min-h-[46px] rounded-[var(--radius)] border border-transparent bg-green px-[26px] py-[13px] text-[15px] font-medium leading-none text-white shadow-[0_1px_3px_oklch(22%_0.014_60_/_0.12)] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(48%_0.120_148_/_0.28)] focus-visible:ring-3 focus-visible:ring-[oklch(48%_0.120_148_/_0.12)]" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Saving..." : "Continue"}
              </Button>
            </form>
          ) : null}

          {step === 1 ? (
            <form className="grid h-[222px] grid-rows-[72px_auto_46px] gap-4 max-[600px]:h-[230px]" onSubmit={handleSubmit}>
              <div className="flex min-h-[72px] flex-col gap-2">
                <div className="text-[11px] font-semibold tracking-[0.1em] text-text-soft uppercase">About your work</div>
                <div className="max-w-[330px] font-heading text-2xl leading-[1.15] tracking-[-0.02em] text-text">What kind of freelance work do you do?</div>
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  autoComplete="organization-title"
                  className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[15px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-3 focus-visible:ring-[oklch(48%_0.120_148_/_0.10)]"
                  name="fieldOfWork"
                  placeholder="Brand designer, web developer..."
                  ref={activeInputRef}
                  value={fieldOfWork}
                  onChange={(event) => {
                    setFieldOfWork(event.target.value);
                    if (submitError) setSubmitError("");
                  }}
                />
                <div className="min-h-[18px] text-xs leading-[1.5] text-text-soft">{submitError || "Optional, but useful for early access."}</div>
              </div>

              <div className="flex items-center justify-between gap-3 max-[600px]:flex-col-reverse max-[600px]:items-stretch">
                <Button className="min-h-[46px] rounded-[var(--radius)] border border-transparent bg-transparent px-3 py-[13px] text-[15px] font-medium leading-none text-text-mid shadow-none hover:bg-bg-alt hover:text-text hover:shadow-none" disabled={isSubmitting} type="button" variant="ghost" onClick={goBack}>
                  Back
                </Button>
                <Button className="min-h-[46px] rounded-[var(--radius)] border border-transparent bg-green px-[26px] py-[13px] text-[15px] font-medium leading-none text-white shadow-[0_1px_3px_oklch(22%_0.014_60_/_0.12)] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(48%_0.120_148_/_0.28)] focus-visible:ring-3 focus-visible:ring-[oklch(48%_0.120_148_/_0.12)]" disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Saving..." : "Continue"}
                </Button>
              </div>
            </form>
          ) : null}

          {step === 2 ? (
            <form className="grid h-[222px] grid-rows-[72px_auto_46px] gap-4 max-[600px]:h-[230px]" onSubmit={handleSubmit}>
              <div className="flex min-h-[72px] flex-col gap-2">
                <div className="text-[11px] font-semibold tracking-[0.1em] text-text-soft uppercase">Project friction</div>
                <div className="max-w-[330px] font-heading text-2xl leading-[1.15] tracking-[-0.02em] text-text">What usually slows projects down?</div>
              </div>

              <div className="flex flex-col gap-2">
                <Input
                  className="w-full rounded-[var(--radius)] border-[1.5px] border-border-mid bg-bg-card px-4 py-[13px] text-[15px] leading-[1.4] text-text shadow-none outline-none placeholder:text-text-soft focus-visible:border-green focus-visible:ring-3 focus-visible:ring-[oklch(48%_0.120_148_/_0.10)]"
                  name="biggestPain"
                  placeholder="Scope creep, approvals, unclear feedback..."
                  ref={activeInputRef}
                  value={biggestPain}
                  onChange={(event) => {
                    setBiggestPain(event.target.value);
                    if (submitError) setSubmitError("");
                  }}
                />
                <div className="min-h-[18px] text-xs leading-[1.5] text-text-soft">{submitError || "One short phrase is enough."}</div>
              </div>

              <div className="flex items-center justify-between gap-3 max-[600px]:flex-col-reverse max-[600px]:items-stretch">
                <Button className="min-h-[46px] rounded-[var(--radius)] border border-transparent bg-transparent px-3 py-[13px] text-[15px] font-medium leading-none text-text-mid shadow-none hover:bg-bg-alt hover:text-text hover:shadow-none" disabled={isSubmitting} type="button" variant="ghost" onClick={goBack}>
                  Back
                </Button>
                <Button className="min-h-[46px] rounded-[var(--radius)] border border-transparent bg-green px-[26px] py-[13px] text-[15px] font-medium leading-none text-white shadow-[0_1px_3px_oklch(22%_0.014_60_/_0.12)] hover:-translate-y-px hover:bg-green-hover hover:shadow-[0_4px_12px_oklch(48%_0.120_148_/_0.28)] focus-visible:ring-3 focus-visible:ring-[oklch(48%_0.120_148_/_0.12)]" disabled={isSubmitting} type="submit">
                  {isSubmitting ? "Joining..." : "Join the waitlist"}
                </Button>
              </div>
            </form>
          ) : null}

          {step === 3 ? (
            <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-center animate-[successContentPop_700ms_cubic-bezier(0.16,1,0.3,1)_260ms_both]">
              <div className="flex size-16 items-center justify-center rounded-full border border-white/30 bg-bg-card text-3xl font-semibold text-green shadow-[0_8px_22px_oklch(22%_0.014_60_/_0.12)]">✓</div>
              <div className="max-w-[330px] font-heading text-2xl leading-[1.15] tracking-[-0.02em] text-white">You&apos;re on the list.</div>
              <p className="max-w-[260px] text-sm leading-[1.65] text-[oklch(96%_0.006_70_/_0.82)]">We&apos;ll reach out when early access opens.</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
