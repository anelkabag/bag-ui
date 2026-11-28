"use client";

import type { ReactNode } from "react";
import { FaSlack } from "react-icons/fa6";
import { SiFigma } from "react-icons/si";

/* ------------------------------------------------------------------ */
/*  Shared pieces                                                      */
/* ------------------------------------------------------------------ */
const BLUE = "#1f7dff";

function Copy({ title, children, className = "" }: { title: string; children: ReactNode; className?: string }) {
  return (
    <p className={`text-[17px] leading-6 tracking-[-0.1px] text-[#8f8f9a] ${className}`}>
      <b className="font-semibold text-[#f3f3f6]">{title}</b> {children}
    </p>
  );
}

function Card({ wide, children }: { wide?: boolean; children: ReactNode }) {
  return (
    <article
      className={`relative overflow-hidden rounded-[20px] border border-[#23232b] bg-[#15151c] max-[1100px]:col-auto ${
        wide ? "col-span-3 h-[452px]" : "col-span-2 h-[416px]"
      }`}
    >
      {children}
    </article>
  );
}

const panelBase =
  "absolute left-1 right-1 overflow-hidden rounded-2xl shadow-[inset_0_0_0_1px_rgba(255,255,255,.04)]";
const panelWide = `${panelBase} bottom-1 top-[100px] bg-[#101016]`;
const panelSmall = `${panelBase} top-1 h-[322px] [background:radial-gradient(60%_55%_at_50%_0%,#1d1d25_0%,#101016_100%)]`;

const Sk = ({ className }: { className: string }) => (
  <span className={`absolute h-1.5 rounded-[3px] bg-[#24242b] ${className}`} />
);

function Stat({ className, label, value }: { className: string; label: string; value: string }) {
  return (
    <div className={`absolute top-[232px] h-[110px] w-[90px] rounded-md border border-[#24242b] bg-[#16161c] p-2 ${className}`}>
      <div className="text-[6.5px] uppercase tracking-[0.3px] text-[#7e7e88]">● {label}</div>
      <div className="mt-[9px] text-[13px] font-semibold tracking-[-0.3px]">{value}</div>
      <div className="mt-[9px] text-[6.5px] text-[#9a9aa3]">View ↗</div>
    </div>
  );
}

function Notif({
  className,
  icon,
  title,
  sub,
  time,
}: {
  className: string;
  icon: ReactNode;
  title: string;
  sub: string;
  time?: string;
}) {
  return (
    <div
      className={`absolute flex items-center gap-2.5 rounded-[14px] border border-white/[.06] bg-[rgba(36,36,42,.88)] px-3 backdrop-blur-[14px] ${className}`}
    >
      {icon}
      <div>
        <div className="whitespace-nowrap text-xs font-semibold leading-4">{title}</div>
        <div className="whitespace-nowrap text-[11px] leading-[15px] text-[#9b9ba5]">{sub}</div>
      </div>
      {time && <span className="ml-auto mt-2.5 self-start whitespace-nowrap text-[10px] text-[#9b9ba5]">{time}</span>}
    </div>
  );
}

const iconCircle = "grid h-7 w-7 flex-none place-items-center rounded-full";

function Orb({ className, children }: { className: string; children: ReactNode }) {
  return (
    <div
      className={`absolute grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#2c2c34] bg-[radial-gradient(circle_at_50%_30%,#24242c,#18181e)] shadow-[0_14px_30px_rgba(0,0,0,.45)] ${className}`}
    >
      {children}
    </div>
  );
}

const Badge = ({ className, n }: { className: string; n: number }) => (
  <div
    className={`absolute grid h-[26px] w-[26px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[3px] border-[#15151c] text-[11px] font-semibold ${className}`}
    style={{ background: BLUE }}
  >
    {n}
  </div>
);

const chip = "flex h-7 items-center whitespace-nowrap rounded-lg px-2.5 text-[13px]";

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export default function BentoFeatures() {
  return (
    <section className="relative mx-auto max-w-[1470px] overflow-hidden rounded-3xl bg-[#0b0b12] px-[126px] pb-[102px] pt-[110px] font-['Inter',system-ui,sans-serif] text-[#f3f3f6] antialiased [line-height:normal] max-[1100px]:rounded-none max-[1100px]:px-4 max-[1100px]:py-[72px]">
      <p className="text-center text-[17px] tracking-[0.1px] text-[#8f8f9a]">BagUi + a dedicated design team to ...</p>
      <h2 className="mt-5 text-center text-[42px] font-medium leading-[48px] tracking-[-1px] max-[1100px]:text-[32px] max-[1100px]:leading-[38px]">
        Scale from a startup to a
        <br />
        worldwide enterprise.
      </h2>

      <div className="mt-[52px] grid grid-cols-6 gap-[22px] max-[1100px]:grid-cols-1">
        {/* ===== 1. 100x Software ===== */}
        <Card wide>
          <Copy title="100x Software requires faster" className="px-6 pt-6">
            Design and development through production grade prototyping and fast iteraction
          </Copy>
          <div className={panelWide}>
            <div className="absolute left-[38px] top-8 h-[360px] w-[514px] overflow-hidden rounded-[10px] border border-[#2b2b33] bg-[#0f0f14] shadow-[0_20px_50px_rgba(0,0,0,.5)]">
              {/* chrome */}
              <div className="relative flex h-[30px] items-center border-b border-[#26262d] bg-[#1b1b21] px-3">
                <div className="flex gap-1.5">
                  <i className="h-[9px] w-[9px] rounded-full bg-[#ff5f57]" />
                  <i className="h-[9px] w-[9px] rounded-full bg-[#febc2e]" />
                  <i className="h-[9px] w-[9px] rounded-full bg-[#28c840]" />
                </div>
                <svg className="ml-3.5" width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="#9a9aa3" strokeWidth={1.2}>
                  <rect x=".6" y=".6" width="10.8" height="8.8" rx="1.5" />
                  <path d="M4 1v8" />
                </svg>
                <div className="absolute left-1/2 top-1.5 flex h-[18px] w-[140px] -translate-x-1/2 items-center justify-center gap-[5px] rounded-[5px] bg-[#2a2a31] text-[10px] text-[#cfcfd6]">
                  <svg width="7" height="8" viewBox="0 0 7 8" fill="#cfcfd6">
                    <rect y="3.4" width="7" height="4.6" rx="1" />
                    <path d="M1.6 3.6V2.4a1.9 1.9 0 0 1 3.8 0v1.2" fill="none" stroke="#cfcfd6" strokeWidth={1} />
                  </svg>
                  100xSoftware.com
                </div>
                <div className="ml-auto flex gap-2.5 text-[#9a9aa3]">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.1}>
                    <circle cx="5" cy="5" r="4" />
                    <path d="M5 3v4M3 5h4" />
                  </svg>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.1}>
                    <path d="M5 1v6M2.5 3.5 5 1l2.5 2.5M1.5 6v3h7V6" />
                  </svg>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.1}>
                    <path d="M5 1v8M1 5h8" />
                  </svg>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth={1.1}>
                    <rect x="1" y="3" width="6" height="6" rx="1" />
                    <path d="M3 1h6v6" />
                  </svg>
                </div>
              </div>

              {/* dashboard */}
              <div className="absolute inset-0 top-[30px] [background-image:linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] [background-size:100%_30px,40px_100%]">
                <Sk className="left-3.5 top-3 w-10" />
                <Sk className="left-[180px] top-3 w-[50px] bg-[#2a2a31]" />
                <span className="absolute left-[236px] top-[9px] text-[7px] text-[#8e8e98]">Accounts</span>
                <span className="absolute left-[398px] top-[9px] text-[7px] text-[#c9c9d1]">● Wilson Ankit ⌄</span>
                <span className="absolute left-[472px] top-2 h-[11px] w-[11px] rounded-full bg-[#8a63ff]" />

                <Sk className="left-3.5 top-11 w-[60px]" />
                <Sk className="left-3.5 top-[66px] w-[90px]" />
                <Sk className="left-3.5 top-[110px] w-[70px]" />
                <Sk className="left-3.5 top-[132px] w-[110px]" />
                <span className="absolute left-3.5 top-[204px] h-[110px] w-[130px] rounded-md border border-[#24242b] bg-[#17171d]" />

                <span className="absolute left-[174px] top-[62px] text-[7px] text-[#7e7e88]">Overview</span>
                <span className="absolute left-[410px] top-[62px] rounded-[3px] border border-[#33333b] px-[5px] py-0.5 text-[6px] text-[#bdbdc6]">
                  ⊕ All Accounts ⌄
                </span>
                <div className="absolute left-[358px] top-[120px] flex gap-[3px]">
                  <i className="h-[9px] w-4 rounded-sm bg-[#3a3a44]" />
                  {[0, 1, 2, 3].map((k) => (
                    <i key={k} className="h-[9px] w-4 rounded-sm bg-[#24242b]" />
                  ))}
                </div>

                <svg className="absolute left-0 top-0" width="514" height="330" viewBox="0 0 514 330" fill="none">
                  <defs>
                    <linearGradient id="bagui-cf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#7fb36a" stopOpacity=".18" />
                      <stop offset="1" stopColor="#7fb36a" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M160 152C172 154 182 158 196 150S220 124 238 128 252 160 268 168 292 178 306 172 322 160 334 158 352 150 362 148"
                    stroke="#86b874"
                    strokeWidth={1.4}
                  />
                  <path
                    d="M160 152C172 154 182 158 196 150S220 124 238 128 252 160 268 168 292 178 306 172 322 160 334 158 352 150 362 148V210H160Z"
                    fill="url(#bagui-cf)"
                  />
                  <circle cx="345" cy="152" r="2.4" fill="#fff" />
                </svg>
                <div className="absolute left-[328px] top-[166px] w-9 rounded-[3px] bg-[#f2f2f2] px-1 py-[3px] text-[6px] font-semibold leading-[7px] text-[#111]">
                  $28,186
                  <br />
                  <span className="font-normal text-[#555]">Apr 12</span>
                </div>

                <Stat className="left-[162px]" label="Treasury" value="$1,959" />
                <Stat className="left-[260px]" label="Operating" value="$28,186.00" />
                <Stat className="left-[358px]" label="Spend" value="-$28,186.00" />
              </div>

              {/* scan */}
              <div className="absolute bottom-0 left-0 top-[30px] w-[157px] border-r-2 border-[#3b8bff] bg-[linear-gradient(90deg,rgba(31,125,255,0)_0%,rgba(31,125,255,.12)_55%,rgba(31,125,255,.42)_100%)] shadow-[6px_0_18px_rgba(59,139,255,.35)]" />
              <div
                className="absolute left-[156px] top-[174px] flex h-[22px] -translate-x-1/2 -translate-y-1/2 items-center rounded-[11px] px-[9px] text-[11.5px] font-semibold shadow-[0_0_0_3px_rgba(31,125,255,.25)]"
                style={{ background: BLUE }}
              >
                100x
              </div>
            </div>
          </div>
        </Card>

        {/* ===== 2. Onboarding ===== */}
        <Card wide>
          <Copy title="Onboard and start in under 24 hours" className="px-6 pt-6">
            from contract to design and development fast. We know time is crucial for startups.
          </Copy>
          <div className={panelWide}>
            <div className="absolute left-[190px] top-[46px] h-[470px] w-[226px] -rotate-[4deg] rounded-[44px] bg-[#0d0d10] p-[7px] shadow-[inset_0_0_0_2px_#3a3a40,0_30px_60px_rgba(0,0,0,.6)]">
              <div className="relative h-full w-full overflow-hidden rounded-[38px] [background:radial-gradient(120%_70%_at_110%_60%,#6d6d72_0%,transparent_55%),radial-gradient(80%_60%_at_-10%_90%,#9a9aa0_0%,transparent_60%),radial-gradient(90%_60%_at_40%_40%,#4b4b50_0%,transparent_70%),linear-gradient(160deg,#3a3a3f_0%,#58585e_50%,#2b2b30_100%)]">
                <div className="absolute left-1/2 top-2.5 h-5 w-[70px] -translate-x-1/2 rounded-xl bg-black" />
                <div className="absolute inset-x-0 top-[58px] text-center">
                  <small className="block text-xs font-semibold text-white/85">Mon 3</small>
                  <b className="-mt-1 block text-[78px] font-semibold leading-none tracking-[-2px] text-white/[.92]">9:41</b>
                </div>
              </div>
            </div>

            <Notif
              className="left-[34px] top-[18px] h-14 w-[200px]"
              icon={
                <span className="grid h-[26px] w-[26px] flex-none place-items-center rounded-[7px] bg-[#e8e8ea]">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="#111">
                    <path d="M2 1h8v6l-4 4-4-4z" />
                    <path d="M4.5 4h3M4.5 6h3" stroke="#e8e8ea" strokeWidth={1.1} />
                  </svg>
                </span>
              }
              title="OK! We're ready to start"
              sub="Docusign complete..."
            />
            <Notif
              className="left-[274px] top-[94px] h-[52px] w-[292px]"
              icon={<span className={`${iconCircle} bg-[#f1f1f1] text-xs font-bold text-[#111]`}>B</span>}
              title="Onboarding documents"
              sub="First designs in 24 hours."
              time="9:41 AM"
            />
            <Notif
              className="left-[274px] top-[154px] h-[52px] w-[292px]"
              icon={
                <span className={`${iconCircle} bg-white`}>
                  <FaSlack color="#4A154B" className="h-4 w-4" />
                </span>
              }
              title="Private Slack Channel"
              sub="Progress updates."
              time="9:41 AM"
            />
            <Notif
              className="left-[274px] top-[216px] h-[52px] w-[292px]"
              icon={
                <span className={`${iconCircle} bg-[#1e1e1e]`}>
                  <SiFigma color="#F24E1E" className="h-4 w-4" />
                </span>
              }
              title="Figma invitation"
              sub="Comment directly while we work."
              time="9:41 AM"
            />

            <div
              className="absolute left-[26px] top-[292px] flex h-9 items-center rounded-[14px_14px_14px_4px] px-3.5 text-[12.5px] font-medium"
              style={{ background: BLUE }}
            >
              You guys are fast!
            </div>
          </div>
        </Card>

        {/* ===== 3. Communication ===== */}
        <Card>
          <div className={panelSmall}>
            <div className="absolute left-[118px] top-[30px] flex h-[50px] w-[246px] items-center gap-2.5 rounded-xl border border-[#2b2b33] bg-[#1f1f26] px-3">
              <span className="grid h-6 w-6 flex-none place-items-center rounded-full bg-[#e9e9ec] text-[11px] font-bold text-[#111]">B</span>
              <div>
                <div className="text-xs font-semibold leading-[15px]">20 new comments</div>
                <div className="text-[11px] leading-[14px] text-[#9b9ba5]">Will take care as soon as possible.</div>
              </div>
            </div>
            <Orb className="left-[124px] top-[176px]">
              <FaSlack color="#ffffff" className="h-9 w-9" />
            </Orb>
            <Badge className="left-[158px] top-[140px]" n={12} />
            <Orb className="left-[268px] top-[210px]">
              <SiFigma color="#F24E1E" className="h-9 w-[30px]" />
            </Orb>
            <Badge className="left-[302px] top-[174px]" n={8} />
          </div>
          <Copy title="Precise communication." className="absolute left-6 right-6 top-[340px]">
            Feedback loops direct in figma/slack. No waiting
          </Copy>
        </Card>

        {/* ===== 4. Team ===== */}
        <Card>
          <div className={`${panelBase} top-1 h-[322px] bg-[#121218]`}>
            <svg className="absolute left-0 top-0" width="382" height="322" viewBox="0 0 382 322" fill="none">
              <defs>
                <linearGradient id="bagui-cone" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#2a2a33" />
                  <stop offset="1" stopColor="#1a1a21" />
                </linearGradient>
              </defs>
              <path d="M0 0 191 205 382 0" stroke="#2a2a32" strokeWidth={1.2} />
              <path d="M191 120 30 322H352Z" fill="url(#bagui-cone)" />
              <path d="M191 120 30 322M191 120 352 322" stroke="#33333c" strokeWidth={1} />
            </svg>
            <div
              className="absolute left-[196px] top-[94px] grid h-[76px] w-[76px] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full text-[17px] font-medium shadow-[0_0_0_8px_rgba(31,125,255,.08),0_10px_30px_rgba(31,125,255,.35)]"
              style={{ background: BLUE }}
            >
              You
            </div>
            <div className="absolute left-[22px] right-[22px] top-[263px] h-7 overflow-hidden">
              <div className="absolute -left-[34px] top-0 flex gap-2.5">
                <span className={`${chip} bg-[#2a2a31]`}>Manager</span>
                <span className={chip} style={{ background: BLUE }}>
                  Designer
                </span>
                <span className={`${chip} bg-[#2a2a31]`}>Developer</span>
                <span className={`${chip} bg-[#2a2a31]`}>Social Media</span>
              </div>
            </div>
            <svg className="absolute left-[158px] top-[282px] w-[18px]" viewBox="0 0 18 20" fill="#fff" stroke="#111" strokeWidth={1.1}>
              <path d="M6 1.5c.9 0 1.5.6 1.5 1.5v6l.9-.3c.8-.2 1.5.3 1.6 1l.1.3.6-.2c.8-.2 1.5.3 1.6 1v.2l.5-.1c.9-.1 1.6.5 1.6 1.3v3.3c0 2.3-1.8 4-4 4H9.6c-1.4 0-2.7-.7-3.4-1.9L2.8 13c-.4-.7-.2-1.6.5-2 .6-.3 1.3-.2 1.7.3l1 1.2V3c0-.9.5-1.5 1.4-1.5z" />
            </svg>
          </div>
          <Copy title="Your dedicated team." className="absolute left-6 right-6 top-[340px]">
            Work and comment in the moment to shorten time...
          </Copy>
        </Card>

        {/* ===== 5. Founder ===== */}
        <Card>
          <div className={panelSmall}>
            <div className="absolute left-[134px] top-[72px] h-[150px] w-[226px] overflow-hidden rounded-lg border border-[#2a2a32] bg-[#0f0f14]">
              <div className="flex h-3 items-center gap-1 border-b border-[#1f1f26] px-1.5">
                <i className="h-[3px] w-3.5 rounded-sm bg-[#2a2a31]" />
                <i className="h-[3px] w-5 rounded-sm bg-[#2a2a31]" />
                <i className="ml-auto h-1.5 w-1.5 rounded-full bg-[#2a2a31]" />
              </div>
              <div className="px-2 pt-2 text-[5px] text-[#7e7e88]">Total balance</div>
              <div className="px-2 pt-0.5 text-[10px] font-semibold">$12,345.00</div>
              <svg className="absolute left-2 top-11" width="130" height="50" viewBox="0 0 130 50" fill="none">
                <path d="M0 10C14 12 22 8 34 16S56 34 70 30 92 38 104 40 122 44 130 46" stroke="#e5e5ea" strokeWidth={1} />
              </svg>
              <div className="absolute left-[150px] top-[30px] h-[50px] w-[66px] rounded border border-[#24242b] bg-[#17171d]" />
              <div className="absolute left-[150px] top-[86px] h-[50px] w-[66px] rounded border border-[#24242b] bg-[#17171d]" />
              <div className="absolute left-2 top-[104px] h-9 w-[132px] rounded border border-[#24242b] bg-[#17171d]" />
            </div>
            <div className="absolute left-[138px] top-8 w-[224px] rounded-xl border border-[#2b2b33] bg-[#1f1f26] px-3 py-2 text-xs font-medium leading-4">
              This concept would work better. Are you available for a quick chat?
            </div>
            <div className="absolute left-12 top-[144px] flex h-[66px] w-[200px] items-center rounded-[14px] border border-[#33333b] bg-[#25252c] px-3.5 shadow-[0_14px_30px_rgba(0,0,0,.45)]">
              <div>
                <small className="block text-[10.5px] text-[#9b9ba5]">09:00</small>
                <b className="mt-0.5 block text-[13px] font-semibold">Anelka Bag</b>
              </div>
              <span className="ml-auto grid h-8 w-8 place-items-center rounded-full bg-[#ff3b30]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff" className="rotate-[135deg]">
                  <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1z" />
                </svg>
              </span>
            </div>
            <div className="absolute left-[30px] top-[210px] h-20 w-20 overflow-hidden rounded-full border-4 border-[#1b1b22] bg-[#c9b6a7] shadow-[0_10px_24px_rgba(0,0,0,.5)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/avatar.jpeg"
                alt=""
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <Copy title="Founder support." className="absolute left-6 right-6 top-[340px]">
            Gain insights directly from 1:1 consultation with Anelka.
          </Copy>
        </Card>
      </div>
    </section>
  );
}