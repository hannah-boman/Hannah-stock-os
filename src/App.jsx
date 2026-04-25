import { useState, useEffect, useCallback } from "react";

// ─── Persistent Storage Helpers ───────────────────────────────────────────────
const STORAGE_KEY = "hannah_stock_system_v1";

const defaultData = {
  portfolio: [
    { id: 1, name: "두산에너빌리티", code: "034020", market: "KOSPI", qty: 110, avgPrice: 87845, currentPrice: 104500, purpose: "원전 수주 기대감 + 저평가", scenario: "2분기 실적 개선 확인 시 리레이팅", stopLoss: "거래량 없이 20일선 이탈", addBuy: "실적 추정 상향 또는 눌림목 2차 확인", target: 130000, theme: "원자력/에너지", conviction: 4, sector: "에너지" },
    { id: 2, name: "HD현대에너지솔루션", code: "322000", market: "KOSPI", qty: 51, avgPrice: 45000, currentPrice: 89500, purpose: "태양광 수출 + 실적 턴어라운드", scenario: "미국 IRA 수혜 지속 + 수출 증가", stopLoss: "지정학 리스크 확대 시 부분 청산", addBuy: "조정 후 외국인 재유입 확인", target: 110000, theme: "신재생에너지", conviction: 3, sector: "에너지" },
    { id: 3, name: "한미반도체", code: "042700", market: "KOSPI", qty: 20, avgPrice: 295000, currentPrice: 312000, purpose: "HBM 장비 독점 수혜", scenario: "엔비디아 수주 확대 → 실적 상향", stopLoss: "엔비디아 수주 취소 or 경쟁사 진입", addBuy: "반도체 업황 조정 시 추가", target: 400000, theme: "반도체/AI", conviction: 5, sector: "반도체" },
    { id: 4, name: "대한해운", code: "005880", market: "KOSPI", qty: 1000, avgPrice: 2600, currentPrice: 2750, purpose: "해운 업황 반등 + 저PBR", scenario: "운임 상승 + 컨테이너 수요 회복", stopLoss: "운임지수 연속 하락 + 거래량 소멸", addBuy: "BDI 반등 확인 후 추가", target: 3500, theme: "해운/물류", conviction: 3, sector: "해운" },
    { id: 5, name: "실리콘투", code: "257720", market: "KOSDAQ", qty: 100, avgPrice: 46250, currentPrice: 48900, purpose: "K뷰티 글로벌 유통 성장", scenario: "미국/유럽 채널 확대 → 매출 급증", stopLoss: "외국인 연속 매도 + 실적 하회", addBuy: "2차 눌림목 확인 + 기관 재진입", target: 65000, theme: "K뷰티/소비재", conviction: 3, sector: "소비재" },
    { id: 6, name: "케이피에프", code: "024880", market: "KOSPI", qty: 100, avgPrice: 15000, currentPrice: 12500, purpose: "외국인 3일 연속 매수 + 저평가", scenario: "실적 회복 + 기관 매수 유입 시 반등", stopLoss: "외국인 매수 중단 + 지지선 이탈", addBuy: "외국인 4일 이상 연속 매수 확인", target: 18000, theme: "산업재", conviction: 2, sector: "산업재" },
  ],
  trades: [realizedTrades.push(
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"엘오티베큠",profit:-22283,returnRate:-44.1,sellAmount:28280,buyAmount:50500},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"제이엔케이글로벌",profit:-27986,returnRate:-42.1,sellAmount:38500,buyAmount:66400},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"경보제약",profit:-33682,returnRate:-34.4,sellAmount:64240,buyAmount:97780},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"애머릿지",profit:-38947,returnRate:-78.2,sellAmount:10836,buyAmount:49755},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"제로투세븐",profit:-49938,returnRate:-56.9,sellAmount:37850,buyAmount:87700},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"레몬",profit:-55529,returnRate:-62.6,sellAmount:33150,buyAmount:88600},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"엘컴텍",profit:-59344,returnRate:-59.1,sellAmount:41002,buyAmount:100250},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"아이윈",profit:-62500,returnRate:-59.4,sellAmount:42720,buyAmount:105120},

  {date:"2026-02-04",market:"KR",type:"국내주식",name:"슈어소프트테크",profit:-70322,returnRate:-17.5,sellAmount:331200,buyAmount:400800},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"모아데이타",profit:-71165,returnRate:-81.4,sellAmount:16280,buyAmount:87400},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"휴마시스",profit:-78935,returnRate:-72.5,sellAmount:29940,buyAmount:108800},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"미래생명자원",profit:-79660,returnRate:-46.3,sellAmount:92550,buyAmount:172000},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"더블유씨피",profit:-82911,returnRate:-82.0,sellAmount:18140,buyAmount:101000},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"코윈테크",profit:-96560,returnRate:-51.3,sellAmount:91650,buyAmount:188000},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"SM C&C",profit:-96606,returnRate:-71.6,sellAmount:38340,buyAmount:134850},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"대원화성",profit:-101947,returnRate:-63.9,sellAmount:57540,buyAmount:159350},

  {date:"2026-02-04",market:"KR",type:"국내주식",name:"경동인베스트",profit:-119527,returnRate:-38.5,sellAmount:191100,buyAmount:310200},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"미래컴퍼니",profit:-132964,returnRate:-59.4,sellAmount:90750,buyAmount:223500},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"SKAI",profit:-187714,returnRate:-82.0,sellAmount:41202,buyAmount:228800},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"이노진",profit:-197759,returnRate:-70.2,sellAmount:83950,buyAmount:281500},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"디티씨",profit:-223197,returnRate:-58.3,sellAmount:159885,buyAmount:382712},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"푸드나무",profit:-225372,returnRate:-77.7,sellAmount:64500,buyAmount:289700},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"양지사",profit:-232155,returnRate:-48.9,sellAmount:243040,buyAmount:474655},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"케스피온",profit:-243582,returnRate:-56.5,sellAmount:187267,buyAmount:430413},

  {date:"2026-02-04",market:"KR",type:"국내주식",name:"코어라인소프트",profit:-267883,returnRate:-85.9,sellAmount:43750,buyAmount:311500},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"APS이노베이션",profit:-308437,returnRate:-69.5,sellAmount:135500,buyAmount:443600},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"EG",profit:-320120,returnRate:-55.0,sellAmount:261990,buyAmount:581500},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"STX그린로지스",profit:-485603,returnRate:-77.0,sellAmount:144670,buyAmount:629890},
  {date:"2026-02-04",market:"KR",type:"국내주식",name:"다원시스",profit:-703310,returnRate:-82.5,sellAmount:149175,buyAmount:852060},
  {date:"2026-02-03",market:"KR",type:"국내주식",name:"대원전선",profit:56236,returnRate:3.1,sellAmount:1835000,buyAmount:1775095},
  {date:"2026-02-02",market:"KR",type:"국내주식",name:"동일기연",profit:-958,returnRate:-6.2,sellAmount:14350,buyAmount:15280},
  {date:"2026-02-02",market:"KR",type:"국내주식",name:"현우산업",profit:-1897,returnRate:-34.8,sellAmount:3550,buyAmount:5440},

  {date:"2026-02-02",market:"KR",type:"국내주식",name:"KG스틸",profit:-7862,returnRate:-58.7,sellAmount:5530,buyAmount:13380},
  {date:"2026-02-02",market:"KR",type:"국내주식",name:"초록뱀미디어",profit:-22182,returnRate:-54.8,sellAmount:18280,buyAmount:40420},
  {date:"2026-02-02",market:"KR",type:"국내주식",name:"디와이덕양",profit:-22910,returnRate:-63.9,sellAmount:12930,buyAmount:35810},
  {date:"2026-02-02",market:"KR",type:"국내주식",name:"상신전자",profit:-39673,returnRate:-55.7,sellAmount:31500,buyAmount:71100},
  {date:"2026-02-02",market:"KR",type:"국내주식",name:"성일하이텍",profit:-43851,returnRate:-39.3,sellAmount:67700,buyAmount:111400},
  {date:"2026-02-02",market:"KR",type:"국내주식",name:"제이씨케미칼",profit:-54677,returnRate:-62.8,sellAmount:32400,buyAmount:87000},
  {date:"2026-02-02",market:"KR",type:"국내주식",name:"KG에코솔루션",profit:-62375,returnRate:-70.5,sellAmount:26080,buyAmount:88390},
  {date:"2026-02-02",market:"KR",type:"국내주식",name:"서울옥션",profit:-73725,returnRate:-46.2,sellAmount:86020,buyAmount:159550},

  {date:"2026-01-29",market:"KR",type:"국내주식",name:"테크윙",profit:541680,returnRate:6.2,sellAmount:9160000,buyAmount:8600000},
  {date:"2026-01-29",market:"KR",type:"국내주식",name:"SFA반도체",profit:466640,returnRate:21.1,sellAmount:2680000,buyAmount:2208000},
  {date:"2026-01-29",market:"KR",type:"국내주식",name:"흥국에프엔비",profit:175245,returnRate:14.2,sellAmount:1408485,buyAmount:1230240},
  {date:"2026-01-29",market:"KR",type:"국내주식",name:"리노공업",profit:18700,returnRate:0.1,sellAmount:18300000,buyAmount:18244700},
  {date:"2026-01-29",market:"KR",type:"국내주식",name:"고영",profit:3540,returnRate:0.1,sellAmount:3230000,buyAmount:3220000},
  {date:"2026-01-28",market:"KR",type:"국내주식",name:"비에이치아이",profit:5100,returnRate:0.0,sellAmount:7450000,buyAmount:7430000},
  {date:"2026-01-28",market:"KR",type:"국내주식",name:"심텍",profit:854,returnRate:0.1,sellAmount:573000,buyAmount:571000},
  {date:"2026-01-28",market:"KR",type:"국내주식",name:"HPSP",profit:-160,returnRate:0.0,sellAmount:205000,buyAmount:204750},

  {date:"2026-01-27",market:"KR",type:"국내주식",name:"보성파워텍",profit:-414420,returnRate:-4.7,sellAmount:8410000,buyAmount:8807600},
  {date:"2026-01-26",market:"KR",type:"국내주식",name:"우리기술",profit:24096,returnRate:0.0,sellAmount:24180000,buyAmount:24107544},
  {date:"2026-01-26",market:"KR",type:"국내주식",name:"카카오페이",profit:-142840,returnRate:-9.1,sellAmount:1420000,buyAmount:1560000},
  {date:"2026-01-26",market:"US",type:"해외주식",name:"객소스 AI",profit:-45789,returnRate:-0.5,sellAmount:8297013,buyAmount:8326213},
  {date:"2026-01-24",market:"US",type:"해외주식",name:"오스틴 골드",profit:773184,returnRate:2.2,sellAmount:35668165,buyAmount:34824526},
  {date:"2026-01-22",market:"KR",type:"국내주식",name:"대원전선",profit:285988,returnRate:1.3,sellAmount:22200000,buyAmount:21869612},
  {date:"2026-01-20",market:"KR",type:"국내주식",name:"현대로템",profit:6928640,returnRate:79.4,sellAmount:15680000,buyAmount:8720000},
  {date:"2026-01-19",market:"KR",type:"국내주식",name:"휴림로봇",profit:7557435,returnRate:91.7,sellAmount:15830000,buyAmount:8240909},

  {date:"2026-01-19",market:"KR",type:"국내주식",name:"모베이스",profit:553300,returnRate:95.4,sellAmount:1135600,buyAmount:579944},
  {date:"2026-01-19",market:"KR",type:"국내주식",name:"인벤티아 10R",profit:12911,returnRate:0.0,sellAmount:12936,buyAmount:0},
  {date:"2026-01-19",market:"KR",type:"국내주식",name:"동일기연",profit:12562,returnRate:4.1,sellAmount:318800,buyAmount:305600},
  {date:"2026-01-14",market:"KR",type:"국내주식",name:"한화갤러리아",profit:682307,returnRate:11.9,sellAmount:6390680,buyAmount:5694738}
);
    { id: 1, date: "2026-04-10", name: "실리콘투", type: "매수", qty: 100, price: 46250, total: 4625000, market: "장중 외국인 매수 강세", reason: "외국인 3일 연속 순매수 + 거래량 급증", entry: "기관 동반 매수 + 눌림목 2차 지지 확인", exit: "", emotion: "차분", result: "보유중", score: 8, review: "계획된 매매. 손절선 명확히 설정 후 진입" },
    { id: 2, date: "2026-04-08", name: "한미반도체", type: "매수", qty: 20, price: 295000, total: 5900000, market: "엔비디아 실적 서프라이즈 다음날", reason: "HBM 수혜 직접 수혜 + 수주 기대", entry: "갭상승 후 눌림목에서 매수", exit: "", emotion: "확신", result: "보유중", score: 7, review: "시나리오 명확. 다만 추격 요소 있었음" },
  ],
  news: [
    { id: 1, date: "2026-04-18", source: "WSJ", title: "Fed Officials Signal Patience on Rate Cuts Amid Tariff Uncertainty", summary: "연준 위원들, 관세 불확실성 속 금리 인하 서두르지 않겠다 시사", keywords: ["금리", "연준", "관세"], stocks: ["전반적 부정"], sector: "거시경제", issueType: "금리", importance: "높음", marketImpact: "미국증시 부정", myJudge: "단기 기술주 압박. 반도체 비중 점검 필요", needFollowUp: true },
    { id: 2, date: "2026-04-17", source: "한국경제", title: "외국인, 반도체 장비주 3주 연속 순매수", summary: "외국인 투자자 한미반도체·HPSP 등 장비주 집중 매수 지속", keywords: ["외국인", "반도체", "장비"], stocks: ["한미반도체"], sector: "반도체", issueType: "수급", importance: "높음", marketImpact: "특정 종목 긍정", myJudge: "한미반도체 보유 긍정. 추가매수 검토", needFollowUp: false },
  ],
  calendar: [
    { id: 1, date: "2026-04-18", country: "미국", event: "연준 베이지북 발표", type: "통화정책", result: "경기 완만한 성장, 물가 소폭 둔화", reaction: "증시 보합", relatedStocks: "전반", portfolioImpact: "중립", importance: "중간" },
    { id: 2, date: "2026-04-16", country: "미국", event: "3월 소매판매", type: "경제지표", result: "예상치 하회 (-0.2%)", reaction: "달러 약세, 기술주 반등", relatedStocks: "소비재, 기술주", portfolioImpact: "한미반도체 소폭 긍정", importance: "높음" },
  ],
  stockMaster: [
    { id: 1, name: "두산에너빌리티", code: "034020", sector: "에너지", industry: "발전설비", theme: "원자력,원전수출", keyPoint: "원전 수주 파이프라인 + 두산밥콕 시너지", competitor: "한전기술,비에이치아이", sensitivity: "원전정책,환율,수주공시", checkIndicator: "수주잔고,영업이익률", newsKeyword: "원전,SMR,체코,폴란드" },
    { id: 2, name: "한미반도체", code: "042700", sector: "반도체", industry: "반도체장비", theme: "HBM,AI반도체", keyPoint: "HBM 패키징 장비 독점적 위치", competitor: "ASMPT,Besi", sensitivity: "엔비디아수주,HBM수요,환율", checkIndicator: "수주잔고,마진율", newsKeyword: "HBM,엔비디아,SK하이닉스,TC본더" },
  ],
  aiInputs: [],
  monthlyReview: [],
  lastUpdated: new Date().toISOString(),
};

// ─── Color & Style Constants ──────────────────────────────────────────────────
const COLORS = {
  bg: "#0a0f1e",
  bgCard: "#0f1629",
  bgCardHover: "#141d35",
  border: "#1e2d4a",
  borderLight: "#243657",
  accent: "#3b82f6",
  accentGlow: "#60a5fa",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  text: "#e2e8f0",
  textMuted: "#64748b",
  textDim: "#94a3b8",
};

const tabs = [
  { id: "dashboard", label: "대시보드", icon: "⚡" },
  { id: "portfolio", label: "포트폴리오", icon: "📊" },
  { id: "trades", label: "매매일지", icon: "📝" },
  { id: "news", label: "뉴스아카이브", icon: "📰" },
  { id: "calendar", label: "이슈캘린더", icon: "📅" },
  { id: "monthly", label: "월간리뷰", icon: "🗓" },
  { id: "master", label: "종목마스터", icon: "🗂" },
  { id: "ai", label: "AI입력함", icon: "🤖" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
const fmt = (n) => n?.toLocaleString("ko-KR") ?? "-";
const pct = (n) => (n >= 0 ? `+${n.toFixed(2)}%` : `${n.toFixed(2)}%`);
const pnlColor = (n) => (n > 0 ? COLORS.green : n < 0 ? COLORS.red : COLORS.textDim);
const today = () => new Date().toISOString().split("T")[0];

function calcPnl(pos) {
  const val = pos.currentPrice * pos.qty;
  const cost = pos.avgPrice * pos.qty;
  return { val, cost, pnl: val - cost, pnlPct: ((val - cost) / cost) * 100 };
}

// ─── Sub Components ───────────────────────────────────────────────────────────
function Card({ children, style = {} }) {
  return (
    <div style={{
      background: COLORS.bgCard,
      border: `1px solid ${COLORS.border}`,
      borderRadius: 12,
      padding: "16px 20px",
      ...style
    }}>
      {children}
    </div>
  );
}

function Badge({ label, color = COLORS.accent }) {
  return (
    <span style={{
      background: color + "22",
      color,
      border: `1px solid ${color}44`,
      borderRadius: 6,
      padding: "2px 8px",
      fontSize: 11,
      fontWeight: 600,
    }}>{label}</span>
  );
}

function ConvictionDots({ score }) {
  return (
    <span style={{ display: "flex", gap: 3 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{
          width: 8, height: 8, borderRadius: "50%",
          background: i <= score ? COLORS.accent : COLORS.border,
          display: "inline-block"
        }} />
      ))}
    </span>
  );
}

function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, letterSpacing: "0.05em" }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: "#0a0f1e",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: "8px 12px",
          color: COLORS.text,
          fontSize: 13,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

function Select({ label, value, onChange, options }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, letterSpacing: "0.05em" }}>{label}</label>}
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          background: "#0a0f1e",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: "8px 12px",
          color: COLORS.text,
          fontSize: 13,
          outline: "none",
          width: "100%",
        }}
      >
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function Textarea({ label, value, onChange, rows = 3, placeholder = "" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {label && <label style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, letterSpacing: "0.05em" }}>{label}</label>}
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        style={{
          background: "#0a0f1e",
          border: `1px solid ${COLORS.border}`,
          borderRadius: 8,
          padding: "8px 12px",
          color: COLORS.text,
          fontSize: 13,
          outline: "none",
          width: "100%",
          boxSizing: "border-box",
          resize: "vertical",
        }}
      />
    </div>
  );
}

function Btn({ children, onClick, variant = "primary", style = {} }) {
  const bg = variant === "primary" ? COLORS.accent : variant === "danger" ? COLORS.red : COLORS.border;
  return (
    <button
      onClick={onClick}
      style={{
        background: bg,
        color: "#fff",
        border: "none",
        borderRadius: 8,
        padding: "8px 16px",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

// ─── Dashboard Tab ─────────────────────────────────────────────────────────────
function Dashboard({ data }) {
  const totalVal = data.portfolio.reduce((s, p) => s + calcPnl(p).val, 0);
  const totalCost = data.portfolio.reduce((s, p) => s + calcPnl(p).cost, 0);
  const totalPnl = totalVal - totalCost;
  const totalPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const realizedPnl = data.trades.filter(t => t.result !== "보유중").reduce((s, t) => s + (t.pnl || 0), 0);
  const todayNews = data.news.filter(n => n.date === today()).slice(0, 3);
  const recentNews = data.news.slice(0, 5);
  const upcomingEvents = data.calendar.slice(0, 3);

  const sectorMap = {};
  data.portfolio.forEach(p => {
    const { val } = calcPnl(p);
    sectorMap[p.sector] = (sectorMap[p.sector] || 0) + val;
  });
  const topSector = Object.entries(sectorMap).sort((a,b) => b[1]-a[1])[0];

  const warnings = [];
  data.portfolio.forEach(p => {
    const { pnlPct } = calcPnl(p);
    if (pnlPct < -15) warnings.push(`⚠️ ${p.name} 손실 ${pct(pnlPct)} — 손절 기준 재검토`);
    if (p.conviction <= 2) warnings.push(`🔍 ${p.name} 확신도 낮음 — 포지션 점검 필요`);
  });

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
        {[
          { label: "총 평가금액", value: `₩${fmt(Math.round(totalVal))}`, sub: `투자원금 ₩${fmt(Math.round(totalCost))}`, color: COLORS.cyan },
          { label: "총 수익률", value: pct(totalPct), sub: `손익 ₩${fmt(Math.round(totalPnl))}`, color: pnlColor(totalPnl) },
          { label: "보유 종목 수", value: `${data.portfolio.length}종목`, sub: topSector ? `${topSector[0]} 비중 최대` : "", color: COLORS.purple },
          { label: "이번 달 실현손익", value: `₩${fmt(realizedPnl)}`, sub: `매매 ${data.trades.length}건`, color: COLORS.green },
        ].map(k => (
          <Card key={k.label}>
            <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6 }}>{k.label}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: k.color, fontFamily: "monospace" }}>{k.value}</div>
            <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 4 }}>{k.sub}</div>
          </Card>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {/* Portfolio mini */}
        <Card>
          <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 12 }}>📊 보유종목 현황</div>
          {data.portfolio.map(p => {
            const { pnl, pnlPct } = calcPnl(p);
            return (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <div>
                  <span style={{ fontWeight: 700, color: COLORS.text, fontSize: 13 }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 6 }}>{p.qty}주</span>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: pnlColor(pnl), fontFamily: "monospace" }}>{pct(pnlPct)}</div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted }}>{fmt(p.currentPrice)}원</div>
                </div>
              </div>
            );
          })}
        </Card>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Warnings */}
          {warnings.length > 0 && (
            <Card style={{ borderColor: COLORS.yellow + "44" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.yellow, marginBottom: 8 }}>⚡ 경고 신호</div>
              {warnings.map((w, i) => (
                <div key={i} style={{ fontSize: 12, color: COLORS.textDim, padding: "4px 0" }}>{w}</div>
              ))}
            </Card>
          )}

          {/* Recent News */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>📰 최근 뉴스</div>
            {recentNews.map(n => (
              <div key={n.id} style={{ padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 12, color: COLORS.text, fontWeight: 600, lineHeight: 1.4 }}>{n.title.length > 40 ? n.title.slice(0, 40) + "…" : n.title}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <Badge label={n.date} color={COLORS.textMuted} />
                  <Badge label={n.issueType} color={COLORS.accent} />
                  <Badge label={n.importance} color={n.importance === "높음" ? COLORS.red : COLORS.yellow} />
                </div>
              </div>
            ))}
          </Card>

          {/* Upcoming Events */}
          <Card>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 8 }}>📅 최근 이벤트</div>
            {upcomingEvents.map(e => (
              <div key={e.id} style={{ padding: "6px 0", borderBottom: `1px solid ${COLORS.border}` }}>
                <div style={{ fontSize: 12, color: COLORS.text, fontWeight: 600 }}>{e.event}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  <Badge label={e.date} color={COLORS.textMuted} />
                  <Badge label={e.country} color={COLORS.cyan} />
                  <Badge label={e.importance} color={e.importance === "높음" ? COLORS.red : COLORS.yellow} />
                </div>
                {e.result && <div style={{ fontSize: 11, color: COLORS.textDim, marginTop: 3 }}>결과: {e.result}</div>}
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}

// ─── Portfolio Tab ─────────────────────────────────────────────────────────────
function Portfolio({ data, setData }) {
  const [selected, setSelected] = useState(null);
  const [form, setForm] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const blank = { name: "", code: "", market: "KOSPI", qty: 0, avgPrice: 0, currentPrice: 0, purpose: "", scenario: "", stopLoss: "", addBuy: "", target: 0, theme: "", conviction: 3, sector: "" };

  const openEdit = (p) => { setSelected(p.id); setForm({ ...p }); setShowAdd(false); };
  const openAdd = () => { setForm({ ...blank }); setShowAdd(true); setSelected(null); };

  const save = () => {
    if (showAdd) {
      setData(d => ({ ...d, portfolio: [...d.portfolio, { ...form, id: Date.now() }] }));
    } else {
      setData(d => ({ ...d, portfolio: d.portfolio.map(p => p.id === selected ? form : p) }));
    }
    setForm(null); setSelected(null); setShowAdd(false);
  };

  const del = (id) => setData(d => ({ ...d, portfolio: d.portfolio.filter(p => p.id !== id) }));

  const totalVal = data.portfolio.reduce((s, p) => s + calcPnl(p).val, 0);

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>보유 종목</div>
          <Btn onClick={openAdd}>+ 종목 추가</Btn>
        </div>
        {data.portfolio.map(p => {
          const { val, pnl, pnlPct } = calcPnl(p);
          const weight = totalVal > 0 ? (val / totalVal) * 100 : 0;
          return (
            <Card key={p.id} style={{ marginBottom: 10, cursor: "pointer", borderColor: selected === p.id ? COLORS.accent : COLORS.border }}
              onClick={() => openEdit(p)}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <span style={{ fontWeight: 800, fontSize: 15, color: COLORS.text }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>{p.code} · {p.market}</span>
                  <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                    <Badge label={p.theme} color={COLORS.purple} />
                    <Badge label={p.sector} color={COLORS.cyan} />
                    <span style={{ display: "flex", alignItems: "center", gap: 4 }}><ConvictionDots score={p.conviction} /></span>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color: pnlColor(pnl), fontFamily: "monospace" }}>{pct(pnlPct)}</div>
                  <div style={{ fontSize: 12, color: COLORS.textMuted }}>{fmt(p.currentPrice)}원 · {p.qty}주</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim }}>비중 {weight.toFixed(1)}%</div>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 12, padding: "10px 0", borderTop: `1px solid ${COLORS.border}` }}>
                {[
                  { l: "매수 목적", v: p.purpose },
                  { l: "손절 기준", v: p.stopLoss },
                  { l: "추가매수", v: p.addBuy },
                ].map(x => (
                  <div key={x.l}>
                    <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, marginBottom: 3 }}>{x.l}</div>
                    <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.4 }}>{x.v || "-"}</div>
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Edit Panel */}
      {form && (
        <div style={{ width: 340, flexShrink: 0 }}>
          <Card style={{ position: "sticky", top: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>
              {showAdd ? "종목 추가" : "종목 수정"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="종목명" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                <Input label="코드" value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <Input label="보유수량" type="number" value={form.qty} onChange={v => setForm(f => ({ ...f, qty: +v }))} />
                <Input label="평균단가" type="number" value={form.avgPrice} onChange={v => setForm(f => ({ ...f, avgPrice: +v }))} />
                <Input label="현재가" type="number" value={form.currentPrice} onChange={v => setForm(f => ({ ...f, currentPrice: +v }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Select label="시장" value={form.market} onChange={v => setForm(f => ({ ...f, market: v }))} options={["KOSPI","KOSDAQ","나스닥","NYSE"]} />
                <Input label="섹터" value={form.sector} onChange={v => setForm(f => ({ ...f, sector: v }))} />
              </div>
              <Input label="테마" value={form.theme} onChange={v => setForm(f => ({ ...f, theme: v }))} />
              <Textarea label="매수 목적" value={form.purpose} onChange={v => setForm(f => ({ ...f, purpose: v }))} rows={2} />
              <Textarea label="투자 시나리오" value={form.scenario} onChange={v => setForm(f => ({ ...f, scenario: v }))} rows={2} />
              <Textarea label="손절 기준" value={form.stopLoss} onChange={v => setForm(f => ({ ...f, stopLoss: v }))} rows={2} />
              <Textarea label="추가매수 기준" value={form.addBuy} onChange={v => setForm(f => ({ ...f, addBuy: v }))} rows={2} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="목표가" type="number" value={form.target} onChange={v => setForm(f => ({ ...f, target: +v }))} />
                <Select label="확신도" value={form.conviction} onChange={v => setForm(f => ({ ...f, conviction: +v }))} options={[1,2,3,4,5]} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={save} style={{ flex: 1 }}>저장</Btn>
                {!showAdd && <Btn variant="danger" onClick={() => { del(selected); setForm(null); }}>삭제</Btn>}
                <Btn variant="ghost" onClick={() => { setForm(null); setSelected(null); }}>취소</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Trades Tab ───────────────────────────────────────────────────────────────
function Trades({ data, setData }) {
  const blank = { date: today(), name: "", type: "매수", qty: 0, price: 0, total: 0, market: "", reason: "", entry: "", exit: "", emotion: "차분", result: "보유중", score: 5, review: "" };
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);

  const openAdd = () => { setForm({ ...blank }); setEditId(null); };
  const openEdit = (t) => { setForm({ ...t }); setEditId(t.id); };
  const save = () => {
    if (editId) {
      setData(d => ({ ...d, trades: d.trades.map(t => t.id === editId ? { ...form, id: editId } : t) }));
    } else {
      setData(d => ({ ...d, trades: [{ ...form, id: Date.now() }, ...d.trades] }));
    }
    setForm(null); setEditId(null);
  };
  const del = (id) => setData(d => ({ ...d, trades: d.trades.filter(t => t.id !== id) }));

  const emotionColor = { "차분": COLORS.green, "확신": COLORS.cyan, "조급": COLORS.yellow, "불안": COLORS.red, "FOMO": COLORS.red, "복수심": "#f97316" };

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>매매일지</div>
          <Btn onClick={openAdd}>+ 매매 기록</Btn>
        </div>
        {data.trades.map(t => (
          <Card key={t.id} style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => openEdit(t)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: 15, color: COLORS.text }}>{t.name}</span>
                <span style={{ marginLeft: 8, padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700, background: t.type === "매수" ? COLORS.green + "22" : COLORS.red + "22", color: t.type === "매수" ? COLORS.green : COLORS.red }}>{t.type}</span>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <Badge label={t.date} color={COLORS.textMuted} />
                  <Badge label={t.emotion} color={emotionColor[t.emotion] || COLORS.textMuted} />
                  <Badge label={`점수 ${t.score}/10`} color={t.score >= 7 ? COLORS.green : t.score >= 5 ? COLORS.yellow : COLORS.red} />
                  <Badge label={t.result} color={t.result === "성공" ? COLORS.green : t.result === "실패" ? COLORS.red : COLORS.textMuted} />
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, fontFamily: "monospace" }}>{fmt(t.price)}원</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{t.qty}주 · 총 {fmt(t.total)}원</div>
              </div>
            </div>
            {t.reason && (
              <div style={{ marginTop: 10, padding: "8px 12px", background: "#0a0f1e", borderRadius: 8, fontSize: 12, color: COLORS.textDim, lineHeight: 1.5 }}>
                <span style={{ color: COLORS.textMuted, fontWeight: 600 }}>매매이유: </span>{t.reason}
              </div>
            )}
            {t.review && (
              <div style={{ marginTop: 6, fontSize: 11, color: COLORS.accent, fontStyle: "italic" }}>💬 {t.review}</div>
            )}
          </Card>
        ))}
      </div>

      {form && (
        <div style={{ width: 340, flexShrink: 0 }}>
          <Card style={{ position: "sticky", top: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>{editId ? "기록 수정" : "매매 기록 추가"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="날짜" type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
                <Input label="종목명" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <Select label="매수/매도" value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={["매수","매도"]} />
                <Input label="수량" type="number" value={form.qty} onChange={v => setForm(f => ({ ...f, qty: +v }))} />
                <Input label="가격" type="number" value={form.price} onChange={v => setForm(f => ({ ...f, price: +v, total: +v * form.qty }))} />
              </div>
              <Textarea label="당시 시장 상황" value={form.market} onChange={v => setForm(f => ({ ...f, market: v }))} rows={2} />
              <Textarea label="매매 이유" value={form.reason} onChange={v => setForm(f => ({ ...f, reason: v }))} rows={2} />
              <Textarea label="진입 근거" value={form.entry} onChange={v => setForm(f => ({ ...f, entry: v }))} rows={2} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <Select label="감정 상태" value={form.emotion} onChange={v => setForm(f => ({ ...f, emotion: v }))} options={["차분","확신","조급","불안","FOMO","복수심"]} />
                <Select label="결과" value={form.result} onChange={v => setForm(f => ({ ...f, result: v }))} options={["보유중","성공","실패","보류"]} />
                <Select label="점수" value={form.score} onChange={v => setForm(f => ({ ...f, score: +v }))} options={[1,2,3,4,5,6,7,8,9,10]} />
              </div>
              <Textarea label="복기 코멘트" value={form.review} onChange={v => setForm(f => ({ ...f, review: v }))} rows={2} placeholder="계획된 매매였는가?" />
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={save} style={{ flex: 1 }}>저장</Btn>
                {editId && <Btn variant="danger" onClick={() => { del(editId); setForm(null); }}>삭제</Btn>}
                <Btn variant="ghost" onClick={() => setForm(null)}>취소</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── News Tab ─────────────────────────────────────────────────────────────────
function News({ data, setData }) {
  const [filter, setFilter] = useState({ issue: "전체", importance: "전체", stock: "" });
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const blank = { date: today(), source: "", title: "", summary: "", keywords: [], stocks: [], sector: "", issueType: "금리", importance: "중간", marketImpact: "중립", myJudge: "", needFollowUp: false };

  const issues = ["전체","금리","CPI/PPI","고용","연준","지정학","정책","실적","수급","공매도","업황","환율","원자재","M&A"];
  const filtered = data.news.filter(n => {
    if (filter.issue !== "전체" && n.issueType !== filter.issue) return false;
    if (filter.importance !== "전체" && n.importance !== filter.importance) return false;
    if (filter.stock && !JSON.stringify(n.stocks).includes(filter.stock)) return false;
    return true;
  });

  const openAdd = () => { setForm({ ...blank, keywords: [], stocks: [] }); setEditId(null); };
  const openEdit = (n) => { setForm({ ...n, keywords: n.keywords || [], stocks: n.stocks || [] }); setEditId(n.id); };
  const save = () => {
    const item = { ...form, keywords: typeof form.keywords === "string" ? form.keywords.split(",").map(s => s.trim()) : form.keywords, stocks: typeof form.stocks === "string" ? form.stocks.split(",").map(s => s.trim()) : form.stocks };
    if (editId) {
      setData(d => ({ ...d, news: d.news.map(n => n.id === editId ? { ...item, id: editId } : n) }));
    } else {
      setData(d => ({ ...d, news: [{ ...item, id: Date.now() }, ...d.news] }));
    }
    setForm(null); setEditId(null);
  };
  const del = (id) => setData(d => ({ ...d, news: d.news.filter(n => n.id !== id) }));

  const importanceColor = { "높음": COLORS.red, "중간": COLORS.yellow, "낮음": COLORS.textMuted };

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>뉴스 아카이브 ({filtered.length}건)</div>
          <Btn onClick={openAdd}>+ 뉴스 추가</Btn>
        </div>
        {/* Filters */}
        <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
          <select value={filter.issue} onChange={e => setFilter(f => ({ ...f, issue: e.target.value }))} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "5px 10px", color: COLORS.text, fontSize: 12 }}>
            {issues.map(i => <option key={i}>{i}</option>)}
          </select>
          <select value={filter.importance} onChange={e => setFilter(f => ({ ...f, importance: e.target.value }))} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "5px 10px", color: COLORS.text, fontSize: 12 }}>
            {["전체","높음","중간","낮음"].map(i => <option key={i}>{i}</option>)}
          </select>
          <input placeholder="종목 검색" value={filter.stock} onChange={e => setFilter(f => ({ ...f, stock: e.target.value }))} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "5px 10px", color: COLORS.text, fontSize: 12, width: 120 }} />
        </div>
        {filtered.map(n => (
          <Card key={n.id} style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => openEdit(n)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text, lineHeight: 1.4, marginBottom: 6 }}>{n.title}</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 8 }}>
                  <Badge label={n.date} color={COLORS.textMuted} />
                  <Badge label={n.source} color={COLORS.cyan} />
                  <Badge label={n.issueType} color={COLORS.accent} />
                  <Badge label={n.importance} color={importanceColor[n.importance]} />
                  {n.needFollowUp && <Badge label="후속확인필요" color={COLORS.yellow} />}
                </div>
                {n.summary && <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.5, marginBottom: 6 }}>{n.summary}</div>}
                {n.myJudge && <div style={{ fontSize: 12, color: COLORS.accent, fontStyle: "italic" }}>💡 {n.myJudge}</div>}
                {n.stocks?.length > 0 && (
                  <div style={{ display: "flex", gap: 4, marginTop: 6 }}>
                    {n.stocks.map(s => <Badge key={s} label={s} color={COLORS.purple} />)}
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>

      {form && (
        <div style={{ width: 340, flexShrink: 0 }}>
          <Card style={{ position: "sticky", top: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>{editId ? "뉴스 수정" : "뉴스 추가"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="날짜" type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
                <Input label="출처" value={form.source} onChange={v => setForm(f => ({ ...f, source: v }))} placeholder="WSJ, 한경..." />
              </div>
              <Input label="기사 제목" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
              <Textarea label="원문/요약" value={form.summary} onChange={v => setForm(f => ({ ...f, summary: v }))} rows={3} />
              <Input label="키워드 (쉼표 구분)" value={Array.isArray(form.keywords) ? form.keywords.join(", ") : form.keywords} onChange={v => setForm(f => ({ ...f, keywords: v }))} />
              <Input label="관련 종목 (쉼표 구분)" value={Array.isArray(form.stocks) ? form.stocks.join(", ") : form.stocks} onChange={v => setForm(f => ({ ...f, stocks: v }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Select label="이슈 종류" value={form.issueType} onChange={v => setForm(f => ({ ...f, issueType: v }))} options={["금리","CPI/PPI","고용","연준","지정학","정책","실적","수급","공매도","업황","환율","원자재","M&A"]} />
                <Select label="중요도" value={form.importance} onChange={v => setForm(f => ({ ...f, importance: v }))} options={["높음","중간","낮음"]} />
              </div>
              <Select label="시장 영향" value={form.marketImpact} onChange={v => setForm(f => ({ ...f, marketImpact: v }))} options={["미국증시 긍정","미국증시 부정","한국증시 긍정","한국증시 부정","특정 종목 긍정","특정 섹터 긍정","중립"]} />
              <Textarea label="내 판단" value={form.myJudge} onChange={v => setForm(f => ({ ...f, myJudge: v }))} rows={2} placeholder="포트폴리오 영향?" />
              <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: COLORS.textDim, cursor: "pointer" }}>
                <input type="checkbox" checked={form.needFollowUp} onChange={e => setForm(f => ({ ...f, needFollowUp: e.target.checked }))} />
                후속 확인 필요
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={save} style={{ flex: 1 }}>저장</Btn>
                {editId && <Btn variant="danger" onClick={() => { del(editId); setForm(null); }}>삭제</Btn>}
                <Btn variant="ghost" onClick={() => setForm(null)}>취소</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Calendar Tab ─────────────────────────────────────────────────────────────
function IssueCalendar({ data, setData }) {
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const [monthFilter, setMonthFilter] = useState(today().slice(0, 7));
  const blank = { date: today(), country: "미국", event: "", type: "경제지표", result: "", reaction: "", relatedStocks: "", portfolioImpact: "", importance: "중간" };

  const filtered = data.calendar.filter(e => e.date.startsWith(monthFilter)).sort((a,b) => b.date.localeCompare(a.date));
  const openAdd = () => { setForm({ ...blank }); setEditId(null); };
  const openEdit = (e) => { setForm({ ...e }); setEditId(e.id); };
  const save = () => {
    if (editId) {
      setData(d => ({ ...d, calendar: d.calendar.map(e => e.id === editId ? { ...form, id: editId } : e) }));
    } else {
      setData(d => ({ ...d, calendar: [{ ...form, id: Date.now() }, ...d.calendar] }));
    }
    setForm(null); setEditId(null);
  };
  const del = (id) => setData(d => ({ ...d, calendar: d.calendar.filter(e => e.id !== id) }));

  const typeColor = { "통화정책": COLORS.purple, "경제지표": COLORS.cyan, "지정학": COLORS.red, "실적": COLORS.green, "정책": COLORS.yellow };

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>이슈 캘린더</div>
            <input type="month" value={monthFilter} onChange={e => setMonthFilter(e.target.value)} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 6, padding: "4px 8px", color: COLORS.text, fontSize: 12 }} />
          </div>
          <Btn onClick={openAdd}>+ 이벤트 추가</Btn>
        </div>
        {filtered.map(e => (
          <Card key={e.id} style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => openEdit(e)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14, color: COLORS.text }}>{e.event}</div>
                <div style={{ display: "flex", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
                  <Badge label={e.date} color={COLORS.textMuted} />
                  <Badge label={e.country} color={COLORS.cyan} />
                  <Badge label={e.type} color={typeColor[e.type] || COLORS.accent} />
                  <Badge label={e.importance} color={e.importance === "높음" ? COLORS.red : COLORS.yellow} />
                </div>
              </div>
            </div>
            {e.result && <div style={{ marginTop: 8, fontSize: 12, color: COLORS.textDim }}><span style={{ color: COLORS.textMuted, fontWeight: 600 }}>결과: </span>{e.result}</div>}
            {e.reaction && <div style={{ fontSize: 12, color: COLORS.textDim }}><span style={{ color: COLORS.textMuted, fontWeight: 600 }}>시장 반응: </span>{e.reaction}</div>}
            {e.portfolioImpact && <div style={{ fontSize: 12, color: COLORS.accent, marginTop: 4 }}>📌 내 포트폴리오: {e.portfolioImpact}</div>}
          </Card>
        ))}
      </div>

      {form && (
        <div style={{ width: 340, flexShrink: 0 }}>
          <Card style={{ position: "sticky", top: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>{editId ? "이벤트 수정" : "이벤트 추가"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="날짜" type="date" value={form.date} onChange={v => setForm(f => ({ ...f, date: v }))} />
                <Select label="국가" value={form.country} onChange={v => setForm(f => ({ ...f, country: v }))} options={["미국","한국","유럽","중국","일본","기타"]} />
              </div>
              <Input label="이벤트명" value={form.event} onChange={v => setForm(f => ({ ...f, event: v }))} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Select label="이벤트 유형" value={form.type} onChange={v => setForm(f => ({ ...f, type: v }))} options={["통화정책","경제지표","지정학","실적","정책","수급","기타"]} />
                <Select label="중요도" value={form.importance} onChange={v => setForm(f => ({ ...f, importance: v }))} options={["높음","중간","낮음"]} />
              </div>
              <Textarea label="실제 결과" value={form.result} onChange={v => setForm(f => ({ ...f, result: v }))} rows={2} />
              <Textarea label="시장 반응" value={form.reaction} onChange={v => setForm(f => ({ ...f, reaction: v }))} rows={2} />
              <Input label="관련 종목/섹터" value={form.relatedStocks} onChange={v => setForm(f => ({ ...f, relatedStocks: v }))} />
              <Textarea label="내 포트폴리오 영향" value={form.portfolioImpact} onChange={v => setForm(f => ({ ...f, portfolioImpact: v }))} rows={2} />
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={save} style={{ flex: 1 }}>저장</Btn>
                {editId && <Btn variant="danger" onClick={() => { del(editId); setForm(null); }}>삭제</Btn>}
                <Btn variant="ghost" onClick={() => setForm(null)}>취소</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Monthly Review Tab ────────────────────────────────────────────────────────
function MonthlyReview({ data, setData }) {
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const blank = { month: today().slice(0, 7), returnRate: 0, realizedPnl: 0, unrealizedPnl: 0, bestStock: "", worstStock: "", topNews: "", industryNews: "", impactNews: "", bestTrades: "", badTrades: "", badHabits: "", strengths: "", doMore: "", doLess: "", never: "", focusSector: "", watchList: "" };

  const openAdd = () => { setForm({ ...blank }); setEditId(null); };
  const openEdit = (r) => { setForm({ ...r }); setEditId(r.id); };
  const save = () => {
    if (editId) {
      setData(d => ({ ...d, monthlyReview: d.monthlyReview.map(r => r.id === editId ? { ...form, id: editId } : r) }));
    } else {
      setData(d => ({ ...d, monthlyReview: [{ ...form, id: Date.now() }, ...d.monthlyReview] }));
    }
    setForm(null); setEditId(null);
  };
  const del = (id) => setData(d => ({ ...d, monthlyReview: d.monthlyReview.filter(r => r.id !== id) }));

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>월간 리뷰</div>
          <Btn onClick={openAdd}>+ 이번 달 리뷰</Btn>
        </div>
        {data.monthlyReview.length === 0 && (
          <Card>
            <div style={{ textAlign: "center", padding: "40px 0", color: COLORS.textMuted, fontSize: 14 }}>
              아직 월간 리뷰가 없어요. 매월 말 기록해두세요! 📅
            </div>
          </Card>
        )}
        {data.monthlyReview.map(r => (
          <Card key={r.id} style={{ marginBottom: 12, cursor: "pointer" }} onClick={() => openEdit(r)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: COLORS.text }}>{r.month} 리뷰</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: pnlColor(r.returnRate), fontFamily: "monospace" }}>{pct(+r.returnRate)}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 12 }}>
              {[
                { l: "실현손익", v: `₩${fmt(r.realizedPnl)}` },
                { l: "최고 종목", v: r.bestStock },
                { l: "최악 종목", v: r.worstStock },
                { l: "집중 섹터", v: r.focusSector },
              ].map(x => (
                <div key={x.l} style={{ background: "#0a0f1e", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600 }}>{x.l}</div>
                  <div style={{ fontSize: 12, color: COLORS.text, marginTop: 3 }}>{x.v || "-"}</div>
                </div>
              ))}
            </div>
            {r.doMore && <div style={{ fontSize: 12, color: COLORS.green }}>✅ 더 할 것: {r.doMore}</div>}
            {r.never && <div style={{ fontSize: 12, color: COLORS.red }}>❌ 절대 하지 말 것: {r.never}</div>}
          </Card>
        ))}
      </div>

      {form && (
        <div style={{ width: 360, flexShrink: 0 }}>
          <Card style={{ position: "sticky", top: 0, maxHeight: "90vh", overflowY: "auto" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>월간 리뷰 작성</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, marginTop: 4 }}>A. 성과</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="월" type="month" value={form.month} onChange={v => setForm(f => ({ ...f, month: v }))} />
                <Input label="월간 수익률 (%)" type="number" value={form.returnRate} onChange={v => setForm(f => ({ ...f, returnRate: +v }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="실현손익" type="number" value={form.realizedPnl} onChange={v => setForm(f => ({ ...f, realizedPnl: +v }))} />
                <Input label="미실현손익" type="number" value={form.unrealizedPnl} onChange={v => setForm(f => ({ ...f, unrealizedPnl: +v }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="최고 종목" value={form.bestStock} onChange={v => setForm(f => ({ ...f, bestStock: v }))} />
                <Input label="최악 종목" value={form.worstStock} onChange={v => setForm(f => ({ ...f, worstStock: v }))} />
              </div>
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, marginTop: 4 }}>B. 뉴스 복기</div>
              <Textarea label="가장 컸던 경제 이슈 (5개)" value={form.topNews} onChange={v => setForm(f => ({ ...f, topNews: v }))} rows={3} />
              <Textarea label="포트폴리오에 영향 준 뉴스" value={form.impactNews} onChange={v => setForm(f => ({ ...f, impactNews: v }))} rows={2} />
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, marginTop: 4 }}>C. 매매 복기</div>
              <Textarea label="가장 좋았던 진입 3개" value={form.bestTrades} onChange={v => setForm(f => ({ ...f, bestTrades: v }))} rows={3} />
              <Textarea label="가장 아쉬운 실수 3개" value={form.badTrades} onChange={v => setForm(f => ({ ...f, badTrades: v }))} rows={3} />
              <Textarea label="반복되는 나쁜 습관" value={form.badHabits} onChange={v => setForm(f => ({ ...f, badHabits: v }))} rows={2} />
              <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.accent, marginTop: 4 }}>D. 다음 달 원칙</div>
              <Textarea label="더 할 것" value={form.doMore} onChange={v => setForm(f => ({ ...f, doMore: v }))} rows={2} />
              <Textarea label="덜 할 것" value={form.doLess} onChange={v => setForm(f => ({ ...f, doLess: v }))} rows={2} />
              <Textarea label="절대 하지 말 것" value={form.never} onChange={v => setForm(f => ({ ...f, never: v }))} rows={2} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="집중 섹터" value={form.focusSector} onChange={v => setForm(f => ({ ...f, focusSector: v }))} />
                <Input label="관찰 종목" value={form.watchList} onChange={v => setForm(f => ({ ...f, watchList: v }))} />
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={save} style={{ flex: 1 }}>저장</Btn>
                {editId && <Btn variant="danger" onClick={() => { del(editId); setForm(null); }}>삭제</Btn>}
                <Btn variant="ghost" onClick={() => setForm(null)}>취소</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── Stock Master Tab ─────────────────────────────────────────────────────────
function StockMaster({ data, setData }) {
  const [form, setForm] = useState(null);
  const [editId, setEditId] = useState(null);
  const blank = { name: "", code: "", sector: "", industry: "", theme: "", keyPoint: "", competitor: "", sensitivity: "", checkIndicator: "", newsKeyword: "" };

  const openAdd = () => { setForm({ ...blank }); setEditId(null); };
  const openEdit = (s) => { setForm({ ...s }); setEditId(s.id); };
  const save = () => {
    if (editId) {
      setData(d => ({ ...d, stockMaster: d.stockMaster.map(s => s.id === editId ? { ...form, id: editId } : s) }));
    } else {
      setData(d => ({ ...d, stockMaster: [{ ...form, id: Date.now() }, ...d.stockMaster] }));
    }
    setForm(null); setEditId(null);
  };
  const del = (id) => setData(d => ({ ...d, stockMaster: d.stockMaster.filter(s => s.id !== id) }));

  return (
    <div style={{ display: "flex", gap: 16 }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>종목 마스터 ({data.stockMaster.length}개)</div>
          <Btn onClick={openAdd}>+ 종목 등록</Btn>
        </div>
        {data.stockMaster.map(s => (
          <Card key={s.id} style={{ marginBottom: 10, cursor: "pointer" }} onClick={() => openEdit(s)}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
              <div>
                <span style={{ fontWeight: 800, fontSize: 15, color: COLORS.text }}>{s.name}</span>
                <span style={{ fontSize: 11, color: COLORS.textMuted, marginLeft: 8 }}>{s.code}</span>
                <div style={{ display: "flex", gap: 6, marginTop: 6 }}>
                  <Badge label={s.sector} color={COLORS.cyan} />
                  <Badge label={s.industry} color={COLORS.purple} />
                  {s.theme.split(",").slice(0,2).map(t => <Badge key={t} label={t.trim()} color={COLORS.accent} />)}
                </div>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { l: "핵심 포인트", v: s.keyPoint },
                { l: "민감 변수", v: s.sensitivity },
                { l: "체크 지표", v: s.checkIndicator },
                { l: "뉴스 키워드", v: s.newsKeyword },
              ].map(x => (
                <div key={x.l} style={{ background: "#0a0f1e", borderRadius: 8, padding: "8px 10px" }}>
                  <div style={{ fontSize: 10, color: COLORS.textMuted, fontWeight: 600, marginBottom: 3 }}>{x.l}</div>
                  <div style={{ fontSize: 11, color: COLORS.textDim, lineHeight: 1.4 }}>{x.v || "-"}</div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {form && (
        <div style={{ width: 340, flexShrink: 0 }}>
          <Card style={{ position: "sticky", top: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>{editId ? "종목 수정" : "종목 등록"}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="종목명" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                <Input label="코드" value={form.code} onChange={v => setForm(f => ({ ...f, code: v }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Input label="섹터" value={form.sector} onChange={v => setForm(f => ({ ...f, sector: v }))} />
                <Input label="산업" value={form.industry} onChange={v => setForm(f => ({ ...f, industry: v }))} />
              </div>
              <Input label="테마 (쉼표 구분)" value={form.theme} onChange={v => setForm(f => ({ ...f, theme: v }))} />
              <Textarea label="핵심 포인트" value={form.keyPoint} onChange={v => setForm(f => ({ ...f, keyPoint: v }))} rows={2} />
              <Input label="경쟁사" value={form.competitor} onChange={v => setForm(f => ({ ...f, competitor: v }))} />
              <Input label="민감 변수" value={form.sensitivity} onChange={v => setForm(f => ({ ...f, sensitivity: v }))} />
              <Input label="체크 지표" value={form.checkIndicator} onChange={v => setForm(f => ({ ...f, checkIndicator: v }))} />
              <Input label="뉴스 키워드" value={form.newsKeyword} onChange={v => setForm(f => ({ ...f, newsKeyword: v }))} />
              <div style={{ display: "flex", gap: 8 }}>
                <Btn onClick={save} style={{ flex: 1 }}>저장</Btn>
                {editId && <Btn variant="danger" onClick={() => { del(editId); setForm(null); }}>삭제</Btn>}
                <Btn variant="ghost" onClick={() => setForm(null)}>취소</Btn>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}

// ─── AI Input Tab ─────────────────────────────────────────────────────────────
function AIInput({ data, setData }) {
  const [raw, setRaw] = useState("");
  const [inputType, setInputType] = useState("직접입력");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const stockNames = data.portfolio.map(p => p.name);

  const analyze = async () => {
    if (!raw.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const portfolioContext = stockNames.join(", ");
      const prompt = `당신은 한국 주식 투자 정보 분류 AI입니다.
아래 텍스트를 분석하여 다음 JSON 형식으로만 응답하세요. JSON 외 다른 텍스트 없이:
{
  "date": "YYYY-MM-DD",
  "type": "뉴스|매매|이슈|메모",
  "summary": "한줄 요약 (30자 이내)",
  "keywords": ["키워드1", "키워드2", "키워드3"],
  "relatedStocks": ["관련종목1"],
  "sector": "관련 섹터",
  "issueType": "금리|CPI/PPI|고용|연준|지정학|정책|실적|수급|공매도|업황|환율|원자재|M&A|기타",
  "importance": "높음|중간|낮음",
  "marketImpact": "한국증시 긍정|한국증시 부정|미국증시 긍정|미국증시 부정|특정 종목 긍정|중립",
  "portfolioImpact": "현재 포트폴리오(${portfolioContext})에 미치는 영향",
  "action": "매수검토|매도검토|보유|관찰|없음"
}

현재 보유 종목: ${portfolioContext}
오늘 날짜: ${today()}

분석할 텍스트:
${raw}`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const d = await res.json();
      const text = d.content?.map(c => c.text || "").join("") || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (e) {
      setResult({ error: "분석 실패. 다시 시도해주세요." });
    }
    setLoading(false);
  };

  const saveToNews = () => {
    if (!result || result.error) return;
    const newsItem = {
      id: Date.now(),
      date: result.date || today(),
      source: inputType,
      title: result.summary,
      summary: raw.slice(0, 500),
      keywords: result.keywords || [],
      stocks: result.relatedStocks || [],
      sector: result.sector || "",
      issueType: result.issueType || "기타",
      importance: result.importance || "중간",
      marketImpact: result.marketImpact || "중립",
      myJudge: result.portfolioImpact || "",
      needFollowUp: result.importance === "높음",
    };
    setData(d => ({ ...d, news: [newsItem, ...d.news], aiInputs: [{ id: Date.now(), date: today(), raw, type: inputType, result, processed: true }, ...d.aiInputs] }));
    setRaw(""); setResult(null);
    alert("뉴스 아카이브에 저장되었습니다!");
  };

  const importanceColor = { "높음": COLORS.red, "중간": COLORS.yellow, "낮음": COLORS.green };
  const actionColor = { "매수검토": COLORS.green, "매도검토": COLORS.red, "관찰": COLORS.yellow, "보유": COLORS.cyan, "없음": COLORS.textMuted };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <div>
        <Card>
          <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>🤖 AI 입력함</div>
          <div style={{ fontSize: 12, color: COLORS.textDim, marginBottom: 14, lineHeight: 1.6, padding: "10px 12px", background: "#0a0f1e", borderRadius: 8, borderLeft: `3px solid ${COLORS.accent}` }}>
            뉴스 기사, 짧은 메모, 요약본 등 아무 형태로나 붙여넣으세요.<br/>
            AI가 자동으로 분류하고 포트폴리오와 연결합니다.
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <Select label="입력 방식" value={inputType} onChange={setInputType} options={["직접입력","기사복붙","AI요약","음성변환","WSJ/NYT요약"]} />
            <Textarea label="정보 입력" value={raw} onChange={setRaw} rows={10} placeholder="여기에 뉴스 기사, 메모, 요약본 등을 자유롭게 입력하세요..." />
            <Btn onClick={analyze} style={{ width: "100%", padding: "12px 0", fontSize: 14 }}>
              {loading ? "AI 분석 중..." : "🤖 AI 자동 분석"}
            </Btn>
          </div>
        </Card>

        {/* History */}
        {data.aiInputs.length > 0 && (
          <Card style={{ marginTop: 12 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.text, marginBottom: 10 }}>처리 이력 ({data.aiInputs.length}건)</div>
            {data.aiInputs.slice(0, 5).map(a => (
              <div key={a.id} style={{ padding: "8px 0", borderBottom: `1px solid ${COLORS.border}`, fontSize: 12 }}>
                <div style={{ color: COLORS.text, fontWeight: 600 }}>{a.result?.summary || a.raw.slice(0, 40)}</div>
                <div style={{ color: COLORS.textMuted, marginTop: 2 }}>{a.date} · {a.type}</div>
              </div>
            ))}
          </Card>
        )}
      </div>

      {/* Result Panel */}
      <div>
        {loading && (
          <Card style={{ textAlign: "center", padding: "60px 0" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🤖</div>
            <div style={{ color: COLORS.textDim, fontSize: 14 }}>AI가 분석 중입니다...</div>
          </Card>
        )}
        {result && !loading && (
          <Card>
            <div style={{ fontSize: 14, fontWeight: 700, color: COLORS.text, marginBottom: 14 }}>✅ 분석 결과</div>
            {result.error ? (
              <div style={{ color: COLORS.red }}>{result.error}</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <div style={{ padding: "12px 14px", background: "#0a0f1e", borderRadius: 10, borderLeft: `3px solid ${COLORS.accent}` }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text, lineHeight: 1.4 }}>{result.summary}</div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  <Badge label={result.date} color={COLORS.textMuted} />
                  <Badge label={result.type} color={COLORS.cyan} />
                  <Badge label={result.issueType} color={COLORS.accent} />
                  <Badge label={result.importance} color={importanceColor[result.importance] || COLORS.textMuted} />
                  <Badge label={`액션: ${result.action}`} color={actionColor[result.action] || COLORS.textMuted} />
                </div>
                <div>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6 }}>키워드</div>
                  <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                    {(result.keywords || []).map(k => <Badge key={k} label={k} color={COLORS.purple} />)}
                  </div>
                </div>
                {result.relatedStocks?.length > 0 && (
                  <div>
                    <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 6 }}>관련 종목</div>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {result.relatedStocks.map(s => <Badge key={s} label={s} color={COLORS.green} />)}
                    </div>
                  </div>
                )}
                <div style={{ padding: "10px 12px", background: "#0a0f1e", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, marginBottom: 4 }}>시장 영향</div>
                  <div style={{ fontSize: 12, color: COLORS.textDim }}>{result.marketImpact}</div>
                </div>
                {result.portfolioImpact && (
                  <div style={{ padding: "10px 12px", background: COLORS.accent + "11", borderRadius: 8, borderLeft: `3px solid ${COLORS.accent}` }}>
                    <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 600, marginBottom: 4 }}>내 포트폴리오 영향</div>
                    <div style={{ fontSize: 12, color: COLORS.textDim, lineHeight: 1.5 }}>{result.portfolioImpact}</div>
                  </div>
                )}
                <Btn onClick={saveToNews} style={{ width: "100%", padding: "12px 0", fontSize: 14 }}>
                  📰 뉴스 아카이브에 저장
                </Btn>
              </div>
            )}
          </Card>
        )}
        {!result && !loading && (
          <Card style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📥</div>
            <div style={{ color: COLORS.textDim, fontSize: 14, lineHeight: 1.6 }}>
              왼쪽에 정보를 입력하고<br/>AI 분석 버튼을 누르세요.<br/><br/>
              <span style={{ color: COLORS.textMuted, fontSize: 12 }}>기사, 메모, 요약본 모두 OK</span>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState(null);
  const [loaded, setLoaded] = useState(false);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const stored = await window.storage.get(STORAGE_KEY);
        if (stored?.value) {
          setData(JSON.parse(stored.value));
        } else {
          setData(defaultData);
        }
      } catch {
        setData(defaultData);
      }
      setLoaded(true);
    })();
  }, []);

  // Save to storage on change
  useEffect(() => {
    if (!loaded || !data) return;
    (async () => {
      try {
        await window.storage.set(STORAGE_KEY, JSON.stringify({ ...data, lastUpdated: new Date().toISOString() }));
      } catch {}
    })();
  }, [data, loaded]);

  if (!loaded) {
    return (
      <div style={{ background: COLORS.bg, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: COLORS.textDim, fontSize: 16 }}>로딩 중...</div>
      </div>
    );
  }

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", fontFamily: "'Pretendard', 'Apple SD Gothic Neo', sans-serif", color: COLORS.text }}>
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${COLORS.border}`, background: COLORS.bgCard, padding: "0 24px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>📈</span>
            <span style={{ fontWeight: 800, fontSize: 16, color: COLORS.text, letterSpacing: "-0.02em" }}>Hannah's Stock OS</span>
            <span style={{ fontSize: 11, color: COLORS.textMuted, background: COLORS.accent + "22", padding: "2px 8px", borderRadius: 20, border: `1px solid ${COLORS.accent}44` }}>v1.0</span>
          </div>
          <div style={{ fontSize: 11, color: COLORS.textMuted }}>{today()} · {data?.portfolio?.length || 0}종목 보유</div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, overflowX: "auto" }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              background: "none", border: "none", cursor: "pointer",
              padding: "10px 14px", fontSize: 12, fontWeight: 600,
              color: activeTab === t.id ? COLORS.accent : COLORS.textMuted,
              borderBottom: `2px solid ${activeTab === t.id ? COLORS.accent : "transparent"}`,
              whiteSpace: "nowrap", transition: "all 0.15s",
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 24px", maxWidth: 1280, margin: "0 auto" }}>
        {activeTab === "dashboard" && <Dashboard data={data} />}
        {activeTab === "portfolio" && <Portfolio data={data} setData={setData} />}
        {activeTab === "trades" && <Trades data={data} setData={setData} />}
        {activeTab === "news" && <News data={data} setData={setData} />}
        {activeTab === "calendar" && <IssueCalendar data={data} setData={setData} />}
        {activeTab === "monthly" && <MonthlyReview data={data} setData={setData} />}
        {activeTab === "master" && <StockMaster data={data} setData={setData} />}
        {activeTab === "ai" && <AIInput data={data} setData={setData} />}
      </div>
    </div>
  );
}
