import { useState, useEffect } from "react";

const STORAGE_KEY = "hannah_stock_system_v2";

const COLORS = {
  bg: "#0a0f1e",
  bgCard: "#0f1629",
  border: "#1e2d4a",
  accent: "#3b82f6",
  green: "#10b981",
  red: "#ef4444",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  cyan: "#06b6d4",
  text: "#e2e8f0",
  textMuted: "#94a3b8",
};

const defaultData = {
  portfolio: [
    { id: 1, name: "두산에너빌리티", code: "034020", market: "KOSPI", qty: 110, avgPrice: 87845, currentPrice: 104500, purpose: "원전 수주 기대감 + 저평가", scenario: "2분기 실적 개선 확인 시 리레이팅", stopLoss: "거래량 없이 20일선 이탈", addBuy: "실적 추정 상향 또는 눌림목 2차 확인", target: 130000, theme: "원자력/에너지", conviction: 4, sector: "에너지" },
    { id: 2, name: "HD현대에너지솔루션", code: "322000", market: "KOSPI", qty: 51, avgPrice: 45000, currentPrice: 89500, purpose: "태양광 수출 + 실적 턴어라운드", scenario: "미국 IRA 수혜 지속 + 수출 증가", stopLoss: "지정학 리스크 확대 시 부분 청산", addBuy: "조정 후 외국인 재유입 확인", target: 110000, theme: "신재생에너지", conviction: 3, sector: "에너지" },
    { id: 3, name: "한미반도체", code: "042700", market: "KOSPI", qty: 20, avgPrice: 295000, currentPrice: 312000, purpose: "HBM 장비 독점 수혜", scenario: "엔비디아 수주 확대 → 실적 상향", stopLoss: "엔비디아 수주 취소 or 경쟁사 진입", addBuy: "반도체 업황 조정 시 추가", target: 400000, theme: "반도체/AI", conviction: 5, sector: "반도체" },
    { id: 4, name: "대한해운", code: "005880", market: "KOSPI", qty: 1000, avgPrice: 2600, currentPrice: 2750, purpose: "해운 업황 반등 + 저PBR", scenario: "운임 상승 + 컨테이너 수요 회복", stopLoss: "운임지수 연속 하락 + 거래량 소멸", addBuy: "BDI 반등 확인 후 추가", target: 3500, theme: "해운/물류", conviction: 3, sector: "해운" },
    { id: 5, name: "실리콘투", code: "257720", market: "KOSDAQ", qty: 100, avgPrice: 46250, currentPrice: 48900, purpose: "K뷰티 글로벌 유통 성장", scenario: "미국/유럽 채널 확대 → 매출 급증", stopLoss: "외국인 연속 매도 + 실적 하회", addBuy: "2차 눌림목 확인 + 기관 재진입", target: 65000, theme: "K뷰티/소비재", conviction: 3, sector: "소비재" },
    { id: 6, name: "케이피에프", code: "024880", market: "KOSPI", qty: 100, avgPrice: 15000, currentPrice: 12500, purpose: "외국인 3일 연속 매수 + 저평가", scenario: "실적 회복 + 기관 매수 유입 시 반등", stopLoss: "외국인 매수 중단 + 지지선 이탈", addBuy: "외국인 4일 이상 연속 매수 확인", target: 18000, theme: "산업재", conviction: 2, sector: "산업재" },
  ],
  trades: [
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
  ],
  watchlist: [],
  news: [],
  calendar: [],
  stockMaster: [
    { id: 1, name: "두산에너빌리티", code: "034020", sector: "에너지", industry: "발전설비", theme: "원자력, 원전수출, SMR", keyPoint: "원전 수주와 정책 모멘텀", competitor: "현대건설, 우리기술", sensitivity: "원전정책, 환율, 수주공시", checkIndicator: "수주잔고, 영업이익률", newsKeyword: "원전, SMR, 체코, 폴란드" },
    { id: 2, name: "한미반도체", code: "042700", sector: "반도체", industry: "반도체장비", theme: "HBM, AI반도체, TC본더", keyPoint: "HBM 장비 사이클 핵심 수혜", competitor: "이오테크닉스, 주성엔지니어링", sensitivity: "엔비디아 수주, HBM 수요, 환율", checkIndicator: "수주잔고, 마진율", newsKeyword: "HBM, 엔비디아, SK하이닉스, TC본더" }
  ],
  aiInputs: [],
  monthlyReview: [],
  lastUpdated: new Date().toISOString(),
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

const fmt = (n) => Number(n || 0).toLocaleString("ko-KR");
const pct = (n) => Number(n || 0) >= 0 ? `+${Number(n || 0).toFixed(2)}%` : `${Number(n || 0).toFixed(2)}%`;
const pnlColor = (n) => Number(n || 0) > 0 ? COLORS.green : Number(n || 0) < 0 ? COLORS.red : COLORS.textMuted;
const today = () => new Date().toISOString().split("T")[0];

function calcPnl(pos) {
  const val = Number(pos.currentPrice || 0) * Number(pos.qty || 0);
  const cost = Number(pos.avgPrice || 0) * Number(pos.qty || 0);
  const pnl = val - cost;
  const pnlPct = cost > 0 ? (pnl / cost) * 100 : 0;
  return { val, cost, pnl, pnlPct };
}

function Card({ children, style = {}, onClick }) {
  return <div onClick={onClick} style={{ background: COLORS.bgCard, border: `1px solid ${COLORS.border}`, borderRadius: 12, padding: "16px 20px", ...style }}>{children}</div>;
}

function Badge({ label, color = COLORS.accent }) {
  return <span style={{ background: color + "22", color, border: `1px solid ${color}44`, borderRadius: 6, padding: "2px 8px", fontSize: 11, fontWeight: 700 }}>{label}</span>;
}

function Btn({ children, onClick, variant = "primary", style = {} }) {
  const bg = variant === "danger" ? COLORS.red : variant === "ghost" ? COLORS.border : COLORS.accent;
  return <button onClick={onClick} style={{ background: bg, color: "#fff", border: 0, borderRadius: 8, padding: "8px 14px", fontWeight: 700, cursor: "pointer", ...style }}>{children}</button>;
}

function Input({ label, value, onChange, type = "text", placeholder = "" }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: COLORS.textMuted, fontWeight: 700 }}>{label}
    <input type={type} value={value ?? ""} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 9, color: COLORS.text }} />
  </label>;
}

function Textarea({ label, value, onChange, rows = 3, placeholder = "" }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: COLORS.textMuted, fontWeight: 700 }}>{label}
    <textarea value={value ?? ""} rows={rows} placeholder={placeholder} onChange={e => onChange(e.target.value)} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 9, color: COLORS.text, resize: "vertical" }} />
  </label>;
}

function Select({ label, value, onChange, options }) {
  return <label style={{ display: "flex", flexDirection: "column", gap: 4, fontSize: 11, color: COLORS.textMuted, fontWeight: 700 }}>{label}
    <select value={value ?? ""} onChange={e => onChange(e.target.value)} style={{ background: COLORS.bg, border: `1px solid ${COLORS.border}`, borderRadius: 8, padding: 9, color: COLORS.text }}>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  </label>;
}

function Dashboard({ data }) {
  const totalVal = data.portfolio.reduce((s, p) => s + calcPnl(p).val, 0);
  const totalCost = data.portfolio.reduce((s, p) => s + calcPnl(p).cost, 0);
  const totalPnl = totalVal - totalCost;
  const totalPct = totalCost ? totalPnl / totalCost * 100 : 0;
  const realizedPnl = data.trades.reduce((s, t) => s + Number(t.profit || 0), 0);
  const wins = data.trades.filter(t => Number(t.profit) > 0).length;
  const losses = data.trades.filter(t => Number(t.profit) < 0).length;
  const avgReturn = data.trades.length ? data.trades.reduce((s, t) => s + Number(t.returnRate || 0), 0) / data.trades.length : 0;

  return <div style={{ display: "grid", gap: 16 }}>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
      <Card><Small>총 평가금액</Small><Big color={COLORS.cyan}>₩{fmt(totalVal)}</Big><Sub>투자원금 ₩{fmt(totalCost)}</Sub></Card>
      <Card><Small>보유 수익률</Small><Big color={pnlColor(totalPnl)}>{pct(totalPct)}</Big><Sub>손익 ₩{fmt(totalPnl)}</Sub></Card>
      <Card><Small>실현손익</Small><Big color={pnlColor(realizedPnl)}>₩{fmt(realizedPnl)}</Big><Sub>매매 {data.trades.length}건</Sub></Card>
      <Card><Small>승패/평균수익률</Small><Big color={COLORS.purple}>{wins}승 {losses}패</Big><Sub>평균 {pct(avgReturn)}</Sub></Card>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <Card>
        <Title>📊 보유종목 현황</Title>
        {data.portfolio.map(p => {
          const r = calcPnl(p);
          return <Row key={p.id}>
            <div><b>{p.name}</b><Sub>{p.qty}주 · 평균 {fmt(p.avgPrice)}원</Sub></div>
            <div style={{ textAlign: "right", color: pnlColor(r.pnl), fontWeight: 800 }}>{pct(r.pnlPct)}<Sub>₩{fmt(r.pnl)}</Sub></div>
          </Row>;
        })}
      </Card>
      <Card>
        <Title>📝 최근 매매 손익</Title>
        {data.trades.slice(0, 12).map((t, i) => <Row key={i}>
          <div><b>{t.name}</b><Sub>{t.date} · {t.type}</Sub></div>
          <div style={{ textAlign: "right", color: pnlColor(t.profit), fontWeight: 800 }}>₩{fmt(t.profit)}<Sub>{pct(t.returnRate)}</Sub></div>
        </Row>)}
      </Card>
    </div>
  </div>;
}

function Small({ children }) { return <div style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 700, marginBottom: 6 }}>{children}</div>; }
function Big({ children, color }) { return <div style={{ fontSize: 22, fontWeight: 900, color, fontFamily: "monospace" }}>{children}</div>; }
function Sub({ children }) { return <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4 }}>{children}</div>; }
function Title({ children }) { return <div style={{ fontSize: 15, color: COLORS.text, fontWeight: 800, marginBottom: 12 }}>{children}</div>; }
function Row({ children }) { return <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "9px 0", borderBottom: `1px solid ${COLORS.border}` }}>{children}</div>; }

function Portfolio({ data, setData }) {
  const blank = { name: "", code: "", market: "KOSPI", qty: 0, avgPrice: 0, currentPrice: 0, purpose: "", scenario: "", stopLoss: "", addBuy: "", target: 0, theme: "", conviction: 3, sector: "" };
  const [form, setForm] = useState(null);
  const save = () => {
    if (!form.id) setData(d => ({ ...d, portfolio: [...d.portfolio, { ...form, id: Date.now() }] }));
    else setData(d => ({ ...d, portfolio: d.portfolio.map(p => p.id === form.id ? form : p) }));
    setForm(null);
  };
  const del = id => { setData(d => ({ ...d, portfolio: d.portfolio.filter(p => p.id !== id) })); setForm(null); };

  return <div style={{ display: "grid", gridTemplateColumns: form ? "1fr 360px" : "1fr", gap: 16 }}>
    <div>
      <Top title="포트폴리오" button="+ 종목 추가" onClick={() => setForm(blank)} />
      {data.portfolio.map(p => {
        const r = calcPnl(p);
        return <Card key={p.id} onClick={() => setForm({ ...p })} style={{ marginBottom: 10, cursor: "pointer" }}>
          <Row>
            <div><b>{p.name}</b><Sub>{p.code} · {p.market} · {p.theme}</Sub></div>
            <div style={{ textAlign: "right", color: pnlColor(r.pnl), fontWeight: 900 }}>{pct(r.pnlPct)}<Sub>₩{fmt(r.pnl)} / 목표 {fmt(p.target)}</Sub></div>
          </Row>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, fontSize: 12, color: COLORS.textMuted }}>
            <div>매수목적: {p.purpose}</div><div>손절: {p.stopLoss}</div><div>추매: {p.addBuy}</div>
          </div>
        </Card>;
      })}
    </div>
    {form && <Editor title={form.id ? "종목 수정" : "종목 추가"} onSave={save} onCancel={() => setForm(null)} onDelete={form.id ? () => del(form.id) : null}>
      <Grid2><Input label="종목명" value={form.name} onChange={v => setForm({ ...form, name: v })} /><Input label="코드" value={form.code} onChange={v => setForm({ ...form, code: v })} /></Grid2>
      <Grid3><Input label="수량" type="number" value={form.qty} onChange={v => setForm({ ...form, qty: +v })} /><Input label="평균단가" type="number" value={form.avgPrice} onChange={v => setForm({ ...form, avgPrice: +v })} /><Input label="현재가" type="number" value={form.currentPrice} onChange={v => setForm({ ...form, currentPrice: +v })} /></Grid3>
      <Grid2><Input label="섹터" value={form.sector} onChange={v => setForm({ ...form, sector: v })} /><Input label="테마" value={form.theme} onChange={v => setForm({ ...form, theme: v })} /></Grid2>
      <Textarea label="매수 목적" value={form.purpose} onChange={v => setForm({ ...form, purpose: v })} />
      <Textarea label="투자 시나리오" value={form.scenario} onChange={v => setForm({ ...form, scenario: v })} />
      <Textarea label="손절 기준" value={form.stopLoss} onChange={v => setForm({ ...form, stopLoss: v })} />
      <Textarea label="추가매수 기준" value={form.addBuy} onChange={v => setForm({ ...form, addBuy: v })} />
    </Editor>}
  </div>;
}

function Trades({ data, setData }) {
  const blank = { date: today(), market: "KR", type: "국내주식", name: "", profit: 0, returnRate: 0, sellAmount: 0, buyAmount: 0, memo: "" };
  const [form, setForm] = useState(null);
  const save = () => {
    if (!form.id) setData(d => ({ ...d, trades: [{ ...form, id: Date.now() }, ...d.trades] }));
    else setData(d => ({ ...d, trades: d.trades.map(t => (t.id || `${t.date}-${t.name}`) === form.id ? form : t) }));
    setForm(null);
  };
  const del = id => { setData(d => ({ ...d, trades: d.trades.filter(t => (t.id || `${t.date}-${t.name}`) !== id) })); setForm(null); };
  const totalProfit = data.trades.reduce((s, t) => s + Number(t.profit || 0), 0);
  const totalSell = data.trades.reduce((s, t) => s + Number(t.sellAmount || 0), 0);
  const totalBuy = data.trades.reduce((s, t) => s + Number(t.buyAmount || 0), 0);
  const totalRate = totalBuy ? totalProfit / totalBuy * 100 : 0;

  return <div style={{ display: "grid", gridTemplateColumns: form ? "1fr 340px" : "1fr", gap: 16 }}>
    <div>
      <Top title={`매매일지 · 총 실현손익 ₩${fmt(totalProfit)} (${pct(totalRate)})`} button="+ 매매 추가" onClick={() => setForm(blank)} />
      {data.trades.map((t, i) => {
        const id = t.id || `${t.date}-${t.name}-${i}`;
        return <Card key={id} onClick={() => setForm({ ...t, id })} style={{ marginBottom: 8, cursor: "pointer" }}>
          <Row>
            <div><b>{t.name}</b><Sub>{t.date} · {t.type} · {t.market}</Sub></div>
            <div style={{ textAlign: "right", color: pnlColor(t.profit), fontWeight: 900 }}>₩{fmt(t.profit)}<Sub>{pct(t.returnRate)} · 매도 {fmt(t.sellAmount)} / 매수 {fmt(t.buyAmount)}</Sub></div>
          </Row>
        </Card>;
      })}
    </div>
    {form && <Editor title="매매 기록" onSave={save} onCancel={() => setForm(null)} onDelete={() => del(form.id)}>
      <Grid2><Input label="날짜" type="date" value={form.date} onChange={v => setForm({ ...form, date: v })} /><Input label="종목명" value={form.name} onChange={v => setForm({ ...form, name: v })} /></Grid2>
      <Grid2><Select label="시장" value={form.market} onChange={v => setForm({ ...form, market: v })} options={["KR","US"]} /><Input label="유형" value={form.type} onChange={v => setForm({ ...form, type: v })} /></Grid2>
      <Grid2><Input label="손익" type="number" value={form.profit} onChange={v => setForm({ ...form, profit: +v })} /><Input label="수익률" type="number" value={form.returnRate} onChange={v => setForm({ ...form, returnRate: +v })} /></Grid2>
      <Grid2><Input label="총 판매금액" type="number" value={form.sellAmount} onChange={v => setForm({ ...form, sellAmount: +v })} /><Input label="총 구매금액" type="number" value={form.buyAmount} onChange={v => setForm({ ...form, buyAmount: +v })} /></Grid2>
      <Textarea label="복기 메모" value={form.memo} onChange={v => setForm({ ...form, memo: v })} />
    </Editor>}
  </div>;
}

function SimpleArchive({ data, setData, type }) {
  const key = type === "news" ? "news" : type === "calendar" ? "calendar" : type === "monthly" ? "monthlyReview" : "stockMaster";
  const title = { news: "뉴스아카이브", calendar: "이슈캘린더", monthly: "월간리뷰", master: "종목마스터" }[type];
  const blank = type === "news"
    ? { date: today(), source: "", title: "", summary: "", issueType: "기타", importance: "중간", marketImpact: "중립", myJudge: "" }
    : type === "calendar"
    ? { date: today(), country: "미국", event: "", type: "경제지표", result: "", reaction: "", portfolioImpact: "", importance: "중간" }
    : type === "monthly"
    ? { month: today().slice(0,7), returnRate: 0, realizedPnl: 0, bestStock: "", worstStock: "", doMore: "", doLess: "", never: "" }
    : { name: "", code: "", sector: "", industry: "", theme: "", keyPoint: "", sensitivity: "", checkIndicator: "", newsKeyword: "" };
  const [form, setForm] = useState(null);
  const list = data[key] || [];
  const save = () => {
    if (!form.id) setData(d => ({ ...d, [key]: [{ ...form, id: Date.now() }, ...(d[key] || [])] }));
    else setData(d => ({ ...d, [key]: (d[key] || []).map(x => x.id === form.id ? form : x) }));
    setForm(null);
  };
  const del = id => { setData(d => ({ ...d, [key]: (d[key] || []).filter(x => x.id !== id) })); setForm(null); };

  return <div style={{ display: "grid", gridTemplateColumns: form ? "1fr 360px" : "1fr", gap: 16 }}>
    <div>
      <Top title={`${title} (${list.length}건)`} button="+ 추가" onClick={() => setForm(blank)} />
      {list.length === 0 && <Card><div style={{ color: COLORS.textMuted, textAlign: "center", padding: 30 }}>아직 기록이 없습니다.</div></Card>}
      {list.map(item => <Card key={item.id} onClick={() => setForm({ ...item })} style={{ marginBottom: 10, cursor: "pointer" }}>
        <div style={{ fontWeight: 900 }}>{item.title || item.event || item.name || item.month}</div>
        <Sub>{item.date || item.month || item.code} {item.importance ? `· ${item.importance}` : ""}</Sub>
        <div style={{ marginTop: 8, color: COLORS.textMuted, fontSize: 12 }}>{item.summary || item.result || item.keyPoint || item.doMore}</div>
      </Card>)}
    </div>
    {form && <Editor title={`${title} 입력`} onSave={save} onCancel={() => setForm(null)} onDelete={form.id ? () => del(form.id) : null}>
      {Object.keys(blank).map(k => k === "summary" || k === "myJudge" || k === "portfolioImpact" || k === "keyPoint" || k === "doMore" || k === "doLess" || k === "never"
        ? <Textarea key={k} label={k} value={form[k]} onChange={v => setForm({ ...form, [k]: v })} />
        : <Input key={k} label={k} type={k === "date" ? "date" : k === "month" ? "month" : k.includes("Rate") || k.includes("Pnl") ? "number" : "text"} value={form[k]} onChange={v => setForm({ ...form, [k]: k.includes("Rate") || k.includes("Pnl") ? +v : v })} />
      )}
    </Editor>}
  </div>;
}

function AIInput({ data, setData }) {
  const [raw, setRaw] = useState("");
  const saveMemo = () => {
    if (!raw.trim()) return;
    const item = { id: Date.now(), date: today(), source: "AI입력함", title: raw.slice(0, 40), summary: raw, issueType: "기타", importance: "중간", marketImpact: "중립", myJudge: "" };
    setData(d => ({ ...d, news: [item, ...d.news], aiInputs: [{ id: Date.now(), date: today(), raw }, ...d.aiInputs] }));
    setRaw("");
    alert("뉴스 아카이브에 저장했습니다.");
  };
  return <Card>
    <Title>🤖 AI 입력함</Title>
    <Sub>지금 버전은 안전하게 메모를 뉴스 아카이브로 저장하는 구조입니다.</Sub>
    <div style={{ marginTop: 16 }}>
      <Textarea label="뉴스/메모 붙여넣기" value={raw} onChange={setRaw} rows={10} placeholder="기사, 메모, 요약본을 붙여넣으세요." />
      <Btn onClick={saveMemo} style={{ marginTop: 12 }}>뉴스 아카이브에 저장</Btn>
    </div>
  </Card>;
}

function Top({ title, button, onClick }) {
  return <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
    <div style={{ fontSize: 16, fontWeight: 900 }}>{title}</div>
    <Btn onClick={onClick}>{button}</Btn>
  </div>;
}
function Grid2({ children }) { return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>{children}</div>; }
function Grid3({ children }) { return <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>{children}</div>; }
function Editor({ title, children, onSave, onCancel, onDelete }) {
  return <Card style={{ position: "sticky", top: 12, display: "flex", flexDirection: "column", gap: 10, maxHeight: "86vh", overflowY: "auto" }}>
    <Title>{title}</Title>
    {children}
    <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
      <Btn onClick={onSave} style={{ flex: 1 }}>저장</Btn>
      {onDelete && <Btn variant="danger" onClick={onDelete}>삭제</Btn>}
      <Btn variant="ghost" onClick={onCancel}>취소</Btn>
    </div>
  </Card>;
}

export default function App() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [data, setData] = useState(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      setData(stored ? JSON.parse(stored) : defaultData);
    } catch {
      setData(defaultData);
    }
  }, []);

  useEffect(() => {
    if (!data) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, lastUpdated: new Date().toISOString() }));
  }, [data]);

  const resetData = () => {
    if (confirm("저장된 데이터를 모두 지우고 기본 데이터로 다시 시작할까요?")) {
      localStorage.removeItem(STORAGE_KEY);
      setData(defaultData);
    }
  };

  if (!data) return <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, display: "grid", placeItems: "center" }}>로딩 중...</div>;

  return <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "Arial, sans-serif" }}>
    <header style={{ background: COLORS.bgCard, borderBottom: `1px solid ${COLORS.border}`, padding: "0 24px" }}>
      <div style={{ height: 58, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 22 }}>📈</span>
          <b>Hannah's Stock OS</b>
          <Badge label="v2.0" color={COLORS.accent} />
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ color: COLORS.textMuted, fontSize: 12 }}>{today()} · {data.portfolio.length}종목 보유</span>
          <Btn variant="ghost" onClick={resetData}>초기화</Btn>
        </div>
      </div>
      <nav style={{ display: "flex", gap: 0, overflowX: "auto" }}>
        {tabs.map(t => <button key={t.id} onClick={() => setActiveTab(t.id)} style={{ background: "none", border: 0, borderBottom: `2px solid ${activeTab === t.id ? COLORS.accent : "transparent"}`, color: activeTab === t.id ? COLORS.accent : COLORS.textMuted, padding: "11px 14px", cursor: "pointer", fontWeight: 800, whiteSpace: "nowrap" }}>{t.icon} {t.label}</button>)}
      </nav>
    </header>
    <main style={{ padding: "20px 24px", maxWidth: 1280, margin: "0 auto" }}>
      {activeTab === "dashboard" && <Dashboard data={data} />}
      {activeTab === "portfolio" && <Portfolio data={data} setData={setData} />}
      {activeTab === "trades" && <Trades data={data} setData={setData} />}
      {activeTab === "news" && <SimpleArchive type="news" data={data} setData={setData} />}
      {activeTab === "calendar" && <SimpleArchive type="calendar" data={data} setData={setData} />}
      {activeTab === "monthly" && <SimpleArchive type="monthly" data={data} setData={setData} />}
      {activeTab === "master" && <SimpleArchive type="master" data={data} setData={setData} />}
      {activeTab === "ai" && <AIInput data={data} setData={setData} />}
    </main>
  </div>;
}
