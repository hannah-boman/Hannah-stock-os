<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Stock OS">
<meta name="theme-color" content="#0a0f1e">
<title>Hannah's Stock OS</title>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.2.0/umd/react.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.2.0/umd/react-dom.production.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.23.2/babel.min.js"></script>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0f1e;font-family:'Apple SD Gothic Neo',-apple-system,sans-serif;color:#e2e8f0;min-height:100vh}
input,select,textarea,button{font-family:inherit}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:#0a0f1e}::-webkit-scrollbar-thumb{background:#1e2d4a;border-radius:2px}
</style>
</head>
<body>
<div id="root"></div>
<script type="text/babel">
const {useState,useEffect}=React;
const C={bg:"#0a0f1e",card:"#0f1629",border:"#1e2d4a",accent:"#3b82f6",green:"#10b981",red:"#ef4444",yellow:"#f59e0b",purple:"#8b5cf6",cyan:"#06b6d4",text:"#e2e8f0",muted:"#64748b",dim:"#94a3b8"};
const fmt=n=>n?.toLocaleString("ko-KR")??"-";
const pct=n=>n>=0?`+${n.toFixed(2)}%`:`${n.toFixed(2)}%`;
const pnlColor=n=>n>0?C.green:n<0?C.red:C.dim;
const today=()=>new Date().toISOString().split("T")[0];
const calcPnl=p=>{const val=p.currentPrice*p.qty,cost=p.avgPrice*p.qty;return{val,cost,pnl:val-cost,pnlPct:((val-cost)/cost)*100}};
const SKEY="hannah_stock_v1";
const load=()=>{try{const v=localStorage.getItem(SKEY);return v?JSON.parse(v):null}catch{return null}};
const save=d=>{try{localStorage.setItem(SKEY,JSON.stringify(d))}catch{}};
const DEF={portfolio:[
{id:1,name:"두산에너빌리티",code:"034020",market:"KOSPI",qty:110,avgPrice:87845,currentPrice:104500,purpose:"원전 수주 기대감 + 저평가",scenario:"2분기 실적 개선 확인 시 리레이팅",stopLoss:"거래량 없이 20일선 이탈",addBuy:"실적 추정 상향 또는 눌림목 2차",target:130000,theme:"원자력/에너지",conviction:4,sector:"에너지"},
{id:2,name:"HD현대에너지솔루션",code:"322000",market:"KOSPI",qty:51,avgPrice:45000,currentPrice:89500,purpose:"태양광 수출+실적 턴어라운드",scenario:"미국 IRA 수혜 지속+수출 증가",stopLoss:"지정학 리스크 확대 시 부분청산",addBuy:"조정 후 외국인 재유입 확인",target:110000,theme:"신재생에너지",conviction:3,sector:"에너지"},
{id:3,name:"한미반도체",code:"042700",market:"KOSPI",qty:20,avgPrice:295000,currentPrice:312000,purpose:"HBM 장비 독점 수혜",scenario:"엔비디아 수주 확대 실적 상향",stopLoss:"엔비디아 수주 취소 or 경쟁사 진입",addBuy:"반도체 업황 조정 시 추가",target:400000,theme:"반도체/AI",conviction:5,sector:"반도체"},
{id:4,name:"대한해운",code:"005880",market:"KOSPI",qty:1000,avgPrice:2600,currentPrice:2750,purpose:"해운 업황 반등+저PBR",scenario:"운임 상승+컨테이너 수요 회복",stopLoss:"운임지수 연속 하락+거래량 소멸",addBuy:"BDI 반등 확인 후 추가",target:3500,theme:"해운/물류",conviction:3,sector:"해운"},
{id:5,name:"실리콘투",code:"257720",market:"KOSDAQ",qty:100,avgPrice:46250,currentPrice:48900,purpose:"K뷰티 글로벌 유통 성장",scenario:"미국/유럽 채널 확대 매출 급증",stopLoss:"외국인 연속 매도+실적 하회",addBuy:"2차 눌림목+기관 재진입",target:65000,theme:"K뷰티/소비재",conviction:3,sector:"소비재"},
{id:6,name:"케이피에프",code:"024880",market:"KOSPI",qty:100,avgPrice:15000,currentPrice:12500,purpose:"외국인 3일 연속 매수+저평가",scenario:"실적 회복+기관 매수 유입 반등",stopLoss:"외국인 매수 중단+지지선 이탈",addBuy:"외국인 4일 이상 연속 매수",target:18000,theme:"산업재",conviction:2,sector:"산업재"},
],trades:[
{id:1,date:"2026-04-10",name:"실리콘투",type:"매수",qty:100,price:46250,total:4625000,reason:"외국인 3일 연속 순매수+거래량 급증",entry:"기관 동반 매수+눌림목 2차 지지",emotion:"차분",result:"보유중",score:8,review:"계획된 매매. 손절선 명확히 설정 후 진입"},
{id:2,date:"2026-04-08",name:"한미반도체",type:"매수",qty:20,price:295000,total:5900000,reason:"HBM 수혜+수주 기대",entry:"갭상승 후 눌림목에서 매수",emotion:"확신",result:"보유중",score:7,review:"시나리오 명확. 다만 추격 요소 있었음"},
],news:[
{id:1,date:"2026-04-18",source:"WSJ",title:"Fed Officials Signal Patience on Rate Cuts",summary:"연준 금리 인하 서두르지 않겠다 시사",keywords:["금리","연준","관세"],stocks:["전반"],sector:"거시경제",issueType:"금리",importance:"높음",marketImpact:"미국증시 부정",myJudge:"단기 기술주 압박. 반도체 비중 점검 필요",needFollowUp:true},
{id:2,date:"2026-04-17",source:"한국경제",title:"외국인 반도체 장비주 3주 연속 순매수",summary:"외국인 투자자 한미반도체 등 집중 매수",keywords:["외국인","반도체","장비"],stocks:["한미반도체"],sector:"반도체",issueType:"수급",importance:"높음",marketImpact:"특정 종목 긍정",myJudge:"한미반도체 보유 긍정. 추가매수 검토",needFollowUp:false},
],calendar:[
{id:1,date:"2026-04-18",country:"미국",event:"연준 베이지북 발표",type:"통화정책",result:"경기 완만한 성장",reaction:"증시 보합",relatedStocks:"전반",portfolioImpact:"중립",importance:"중간"},
],stockMaster:[
{id:1,name:"두산에너빌리티",code:"034020",sector:"에너지",industry:"발전설비",theme:"원자력,원전수출",keyPoint:"원전 수주 파이프라인",competitor:"한전기술",sensitivity:"원전정책,환율",checkIndicator:"수주잔고",newsKeyword:"원전,SMR,체코"},
{id:2,name:"한미반도체",code:"042700",sector:"반도체",industry:"반도체장비",theme:"HBM,AI반도체",keyPoint:"HBM 패키징 장비 독점",competitor:"ASMPT",sensitivity:"엔비디아수주,HBM수요",checkIndicator:"수주잔고",newsKeyword:"HBM,엔비디아"},
],aiInputs:[],monthlyReview:[]};

const Card=({children,style={}})=><div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:12,padding:"16px 20px",...style}}>{children}</div>;
const Badge=({label,color=C.accent})=><span style={{background:color+"22",color,border:`1px solid ${color}44`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:600}}>{label}</span>;
const Dots=({score})=><span style={{display:"flex",gap:3}}>{[1,2,3,4,5].map(i=><span key={i} style={{width:8,height:8,borderRadius:"50%",background:i<=score?C.accent:C.border,display:"inline-block"}}/>)}</span>;
const IS={background:"#060b17",border:`1px solid ${C.border}`,borderRadius:8,padding:"8px 12px",color:C.text,fontSize:13,outline:"none",width:"100%",boxSizing:"border-box"};
const Inp=({label,value,onChange,type="text",placeholder=""})=><div style={{display:"flex",flexDirection:"column",gap:4}}>{label&&<label style={{fontSize:11,color:C.muted,fontWeight:600}}>{label}</label>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={IS}/></div>;
const Sel=({label,value,onChange,options})=><div style={{display:"flex",flexDirection:"column",gap:4}}>{label&&<label style={{fontSize:11,color:C.muted,fontWeight:600}}>{label}</label>}<select value={value} onChange={e=>onChange(e.target.value)} style={IS}>{options.map(o=><option key={o} value={o}>{o}</option>)}</select></div>;
const Txta=({label,value,onChange,rows=3,placeholder=""})=><div style={{display:"flex",flexDirection:"column",gap:4}}>{label&&<label style={{fontSize:11,color:C.muted,fontWeight:600}}>{label}</label>}<textarea value={value} onChange={e=>onChange(e.target.value)} rows={rows} placeholder={placeholder} style={{...IS,resize:"vertical"}}/></div>;
const Btn=({children,onClick,variant="primary",style={}})=><button onClick={onClick} style={{background:variant==="primary"?C.accent:variant==="danger"?C.red:C.border,color:"#fff",border:"none",borderRadius:8,padding:"8px 16px",fontSize:13,fontWeight:600,cursor:"pointer",...style}}>{children}</button>;

const Dashboard=({data})=>{
  const tV=data.portfolio.reduce((s,p)=>s+calcPnl(p).val,0);
  const tC=data.portfolio.reduce((s,p)=>s+calcPnl(p).cost,0);
  const tP=tV-tC,tPct=tC>0?(tP/tC)*100:0;
  const sMap={};data.portfolio.forEach(p=>{const{val}=calcPnl(p);sMap[p.sector]=(sMap[p.sector]||0)+val});
  const top=Object.entries(sMap).sort((a,b)=>b[1]-a[1])[0];
  const warns=[];
  data.portfolio.forEach(p=>{const{pnlPct}=calcPnl(p);if(pnlPct<-15)warns.push(`⚠️ ${p.name} 손실 ${pct(pnlPct)}`);if(p.conviction<=2)warns.push(`🔍 ${p.name} 확신도 낮음`);});
  return<div style={{display:"grid",gap:16}}>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
      {[{l:"총 평가금액",v:`₩${fmt(Math.round(tV))}`,s:`원금 ₩${fmt(Math.round(tC))}`,c:C.cyan},{l:"총 수익률",v:pct(tPct),s:`손익 ₩${fmt(Math.round(tP))}`,c:pnlColor(tP)},{l:"보유 종목",v:`${data.portfolio.length}종목`,s:top?`${top[0]} 최대`:"",c:C.purple},{l:"이번달 실현손익",v:"₩0",s:`매매 ${data.trades.length}건`,c:C.green}].map(k=>(
        <Card key={k.l}><div style={{fontSize:11,color:C.muted,fontWeight:600,marginBottom:6}}>{k.l}</div><div style={{fontSize:20,fontWeight:800,color:k.c,fontFamily:"monospace"}}>{k.v}</div><div style={{fontSize:11,color:C.dim,marginTop:4}}>{k.s}</div></Card>
      ))}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
      <Card>
        <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:12}}>📊 보유종목 현황</div>
        {data.portfolio.map(p=>{const{pnl,pnlPct}=calcPnl(p);return<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:`1px solid ${C.border}`}}><div><span style={{fontWeight:700,color:C.text,fontSize:13}}>{p.name}</span><span style={{fontSize:11,color:C.muted,marginLeft:6}}>{p.qty}주</span></div><div style={{textAlign:"right"}}><div style={{fontSize:13,fontWeight:700,color:pnlColor(pnl),fontFamily:"monospace"}}>{pct(pnlPct)}</div><div style={{fontSize:11,color:C.muted}}>{fmt(p.currentPrice)}원</div></div></div>})}
      </Card>
      <div style={{display:"flex",flexDirection:"column",gap:12}}>
        {warns.length>0&&<Card style={{borderColor:C.yellow+"44"}}><div style={{fontSize:13,fontWeight:700,color:C.yellow,marginBottom:8}}>⚡ 경고 신호</div>{warns.map((w,i)=><div key={i} style={{fontSize:12,color:C.dim,padding:"4px 0"}}>{w}</div>)}</Card>}
        <Card>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:8}}>📰 최근 뉴스</div>
          {data.news.slice(0,4).map(n=><div key={n.id} style={{padding:"6px 0",borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:12,color:C.text,fontWeight:600,lineHeight:1.4}}>{n.title.length>40?n.title.slice(0,40)+"…":n.title}</div><div style={{display:"flex",gap:6,marginTop:4}}><Badge label={n.date} color={C.muted}/><Badge label={n.issueType} color={C.accent}/><Badge label={n.importance} color={n.importance==="높음"?C.red:C.yellow}/></div></div>)}
        </Card>
        <Card>
          <div style={{fontSize:13,fontWeight:700,color:C.text,marginBottom:8}}>📅 이슈 캘린더</div>
          {data.calendar.slice(0,3).map(e=><div key={e.id} style={{padding:"6px 0",borderBottom:`1px solid ${C.border}`}}><div style={{fontSize:12,color:C.text,fontWeight:600}}>{e.event}</div><div style={{display:"flex",gap:6,marginTop:4}}><Badge label={e.date} color={C.muted}/><Badge label={e.country} color={C.cyan}/></div>{e.result&&<div style={{fontSize:11,color:C.dim,marginTop:3}}>결과: {e.result}</div>}</div>)}
        </Card>
      </div>
    </div>
  </div>;
};

const Portfolio=({data,setData})=>{
  const[sel,setSel]=useState(null);const[form,setForm]=useState(null);const[showAdd,setShowAdd]=useState(false);
  const blank={name:"",code:"",market:"KOSPI",qty:0,avgPrice:0,currentPrice:0,purpose:"",scenario:"",stopLoss:"",addBuy:"",target:0,theme:"",conviction:3,sector:""};
  const openEdit=p=>{setSel(p.id);setForm({...p});setShowAdd(false)};
  const openAdd=()=>{setForm({...blank});setShowAdd(true);setSel(null)};
  const saveFn=()=>{if(showAdd)setData(d=>({...d,portfolio:[...d.portfolio,{...form,id:Date.now()}]}));else setData(d=>({...d,portfolio:d.portfolio.map(p=>p.id===sel?form:p)}));setForm(null);setSel(null);setShowAdd(false);};
  const del=id=>setData(d=>({...d,portfolio:d.portfolio.filter(p=>p.id!==id)}));
  const tV=data.portfolio.reduce((s,p)=>s+calcPnl(p).val,0);
  return<div style={{display:"flex",gap:16}}>
    <div style={{flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:15,fontWeight:700,color:C.text}}>보유 종목</div><Btn onClick={openAdd}>+ 종목 추가</Btn>
      </div>
      {data.portfolio.map(p=>{
        const{val,pnl,pnlPct}=calcPnl(p);const w=tV>0?(val/tV)*100:0;
        return<Card key={p.id} style={{marginBottom:10,cursor:"pointer",borderColor:sel===p.id?C.accent:C.border}} onClick={()=>openEdit(p)}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
            <div><span style={{fontWeight:800,fontSize:15,color:C.text}}>{p.name}</span><span style={{fontSize:11,color:C.muted,marginLeft:8}}>{p.code} · {p.market}</span><div style={{display:"flex",gap:6,marginTop:6}}><Badge label={p.theme} color={C.purple}/><Badge label={p.sector} color={C.cyan}/><Dots score={p.conviction}/></div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:20,fontWeight:800,color:pnlColor(pnl),fontFamily:"monospace"}}>{pct(pnlPct)}</div><div style={{fontSize:12,color:C.muted}}>{fmt(p.currentPrice)}원 · {p.qty}주</div><div style={{fontSize:11,color:C.dim}}>비중 {w.toFixed(1)}%</div></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,marginTop:12,padding:"10px 0",borderTop:`1px solid ${C.border}`}}>
            {[{l:"매수 목적",v:p.purpose},{l:"손절 기준",v:p.stopLoss},{l:"추가매수",v:p.addBuy}].map(x=><div key={x.l}><div style={{fontSize:10,color:C.muted,fontWeight:600,marginBottom:3}}>{x.l}</div><div style={{fontSize:11,color:C.dim,lineHeight:1.4}}>{x.v||"-"}</div></div>)}
          </div>
        </Card>;
      })}
    </div>
    {form&&<div style={{width:340,flexShrink:0}}><Card style={{position:"sticky",top:0,maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:14}}>{showAdd?"종목 추가":"종목 수정"}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Inp label="종목명" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))}/><Inp label="코드" value={form.code} onChange={v=>setForm(f=>({...f,code:v}))}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><Inp label="수량" type="number" value={form.qty} onChange={v=>setForm(f=>({...f,qty:+v}))}/><Inp label="평균단가" type="number" value={form.avgPrice} onChange={v=>setForm(f=>({...f,avgPrice:+v}))}/><Inp label="현재가" type="number" value={form.currentPrice} onChange={v=>setForm(f=>({...f,currentPrice:+v}))}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Sel label="시장" value={form.market} onChange={v=>setForm(f=>({...f,market:v}))} options={["KOSPI","KOSDAQ","나스닥","NYSE"]}/><Inp label="섹터" value={form.sector} onChange={v=>setForm(f=>({...f,sector:v}))}/></div>
        <Inp label="테마" value={form.theme} onChange={v=>setForm(f=>({...f,theme:v}))}/>
        <Txta label="매수 목적" value={form.purpose} onChange={v=>setForm(f=>({...f,purpose:v}))} rows={2}/>
        <Txta label="투자 시나리오" value={form.scenario} onChange={v=>setForm(f=>({...f,scenario:v}))} rows={2}/>
        <Txta label="손절 기준" value={form.stopLoss} onChange={v=>setForm(f=>({...f,stopLoss:v}))} rows={2}/>
        <Txta label="추가매수 기준" value={form.addBuy} onChange={v=>setForm(f=>({...f,addBuy:v}))} rows={2}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Inp label="목표가" type="number" value={form.target} onChange={v=>setForm(f=>({...f,target:+v}))}/><Sel label="확신도" value={form.conviction} onChange={v=>setForm(f=>({...f,conviction:+v}))} options={[1,2,3,4,5]}/></div>
        <div style={{display:"flex",gap:8}}><Btn onClick={saveFn} style={{flex:1}}>저장</Btn>{!showAdd&&<Btn variant="danger" onClick={()=>{del(sel);setForm(null);}}>삭제</Btn>}<Btn variant="ghost" onClick={()=>{setForm(null);setSel(null);}}>취소</Btn></div>
      </div>
    </Card></div>}
  </div>;
};

const Trades=({data,setData})=>{
  const blank={date:today(),name:"",type:"매수",qty:0,price:0,total:0,reason:"",entry:"",emotion:"차분",result:"보유중",score:5,review:""};
  const[form,setForm]=useState(null);const[editId,setEditId]=useState(null);
  const openAdd=()=>{setForm({...blank});setEditId(null)};
  const openEdit=t=>{setForm({...t});setEditId(t.id)};
  const saveFn=()=>{if(editId)setData(d=>({...d,trades:d.trades.map(t=>t.id===editId?{...form,id:editId}:t)}));else setData(d=>({...d,trades:[{...form,id:Date.now()},...d.trades]}));setForm(null);setEditId(null);};
  const del=id=>setData(d=>({...d,trades:d.trades.filter(t=>t.id!==id)}));
  const eC={"차분":C.green,"확신":C.cyan,"조급":C.yellow,"불안":C.red,"FOMO":C.red,"복수심":"#f97316"};
  return<div style={{display:"flex",gap:16}}>
    <div style={{flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:15,fontWeight:700,color:C.text}}>매매일지</div><Btn onClick={openAdd}>+ 매매 기록</Btn></div>
      {data.trades.map(t=><Card key={t.id} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>openEdit(t)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div><span style={{fontWeight:800,fontSize:15,color:C.text}}>{t.name}</span><span style={{marginLeft:8,padding:"2px 8px",borderRadius:6,fontSize:11,fontWeight:700,background:(t.type==="매수"?C.green:C.red)+"22",color:t.type==="매수"?C.green:C.red}}>{t.type}</span><div style={{display:"flex",gap:6,marginTop:6}}><Badge label={t.date} color={C.muted}/><Badge label={t.emotion} color={eC[t.emotion]||C.muted}/><Badge label={`점수 ${t.score}/10`} color={t.score>=7?C.green:t.score>=5?C.yellow:C.red}/><Badge label={t.result} color={t.result==="성공"?C.green:t.result==="실패"?C.red:C.muted}/></div></div>
          <div style={{textAlign:"right"}}><div style={{fontSize:14,fontWeight:700,color:C.text,fontFamily:"monospace"}}>{fmt(t.price)}원</div><div style={{fontSize:11,color:C.muted}}>{t.qty}주 · 총 {fmt(t.total)}원</div></div>
        </div>
        {t.reason&&<div style={{marginTop:10,padding:"8px 12px",background:"#060b17",borderRadius:8,fontSize:12,color:C.dim,lineHeight:1.5}}><span style={{color:C.muted,fontWeight:600}}>매매이유: </span>{t.reason}</div>}
        {t.review&&<div style={{marginTop:6,fontSize:11,color:C.accent,fontStyle:"italic"}}>💬 {t.review}</div>}
      </Card>)}
    </div>
    {form&&<div style={{width:340,flexShrink:0}}><Card style={{position:"sticky",top:0,maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:14}}>{editId?"기록 수정":"매매 기록 추가"}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Inp label="날짜" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/><Inp label="종목명" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><Sel label="매수/매도" value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} options={["매수","매도"]}/><Inp label="수량" type="number" value={form.qty} onChange={v=>setForm(f=>({...f,qty:+v}))}/><Inp label="가격" type="number" value={form.price} onChange={v=>setForm(f=>({...f,price:+v,total:+v*form.qty}))}/></div>
        <Txta label="매매 이유" value={form.reason} onChange={v=>setForm(f=>({...f,reason:v}))} rows={2}/>
        <Txta label="진입 근거" value={form.entry} onChange={v=>setForm(f=>({...f,entry:v}))} rows={2}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}><Sel label="감정" value={form.emotion} onChange={v=>setForm(f=>({...f,emotion:v}))} options={["차분","확신","조급","불안","FOMO","복수심"]}/><Sel label="결과" value={form.result} onChange={v=>setForm(f=>({...f,result:v}))} options={["보유중","성공","실패","보류"]}/><Sel label="점수" value={form.score} onChange={v=>setForm(f=>({...f,score:+v}))} options={[1,2,3,4,5,6,7,8,9,10]}/></div>
        <Txta label="복기 코멘트" value={form.review} onChange={v=>setForm(f=>({...f,review:v}))} rows={2} placeholder="계획된 매매였는가?"/>
        <div style={{display:"flex",gap:8}}><Btn onClick={saveFn} style={{flex:1}}>저장</Btn>{editId&&<Btn variant="danger" onClick={()=>{del(editId);setForm(null);}}>삭제</Btn>}<Btn variant="ghost" onClick={()=>setForm(null)}>취소</Btn></div>
      </div>
    </Card></div>}
  </div>;
};

const News=({data,setData})=>{
  const[filter,setFilter]=useState({issue:"전체",importance:"전체",stock:""});
  const[form,setForm]=useState(null);const[editId,setEditId]=useState(null);
  const blank={date:today(),source:"",title:"",summary:"",keywords:[],stocks:[],sector:"",issueType:"금리",importance:"중간",marketImpact:"중립",myJudge:"",needFollowUp:false};
  const issues=["전체","금리","CPI/PPI","고용","연준","지정학","정책","실적","수급","공매도","업황","환율","원자재","M&A"];
  const filtered=data.news.filter(n=>{if(filter.issue!=="전체"&&n.issueType!==filter.issue)return false;if(filter.importance!=="전체"&&n.importance!==filter.importance)return false;if(filter.stock&&!JSON.stringify(n.stocks).includes(filter.stock))return false;return true;});
  const openAdd=()=>{setForm({...blank,keywords:[],stocks:[]});setEditId(null)};
  const openEdit=n=>{setForm({...n,keywords:n.keywords||[],stocks:n.stocks||[]});setEditId(n.id)};
  const saveFn=()=>{const item={...form,keywords:typeof form.keywords==="string"?form.keywords.split(",").map(s=>s.trim()):form.keywords,stocks:typeof form.stocks==="string"?form.stocks.split(",").map(s=>s.trim()):form.stocks};if(editId)setData(d=>({...d,news:d.news.map(n=>n.id===editId?{...item,id:editId}:n)}));else setData(d=>({...d,news:[{...item,id:Date.now()},...d.news]}));setForm(null);setEditId(null);};
  const del=id=>setData(d=>({...d,news:d.news.filter(n=>n.id!==id)}));
  const iC={"높음":C.red,"중간":C.yellow,"낮음":C.muted};
  const SS={background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"5px 10px",color:C.text,fontSize:12};
  return<div style={{display:"flex",gap:16}}>
    <div style={{flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:15,fontWeight:700,color:C.text}}>뉴스 아카이브 ({filtered.length}건)</div><Btn onClick={openAdd}>+ 뉴스 추가</Btn></div>
      <div style={{display:"flex",gap:8,marginBottom:14,flexWrap:"wrap"}}>
        <select value={filter.issue} onChange={e=>setFilter(f=>({...f,issue:e.target.value}))} style={SS}>{issues.map(i=><option key={i}>{i}</option>)}</select>
        <select value={filter.importance} onChange={e=>setFilter(f=>({...f,importance:e.target.value}))} style={SS}>{["전체","높음","중간","낮음"].map(i=><option key={i}>{i}</option>)}</select>
        <input placeholder="종목 검색" value={filter.stock} onChange={e=>setFilter(f=>({...f,stock:e.target.value}))} style={{...SS,width:120}}/>
      </div>
      {filtered.map(n=><Card key={n.id} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>openEdit(n)}>
        <div style={{fontWeight:700,fontSize:14,color:C.text,lineHeight:1.4,marginBottom:6}}>{n.title}</div>
        <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:8}}><Badge label={n.date} color={C.muted}/><Badge label={n.source} color={C.cyan}/><Badge label={n.issueType} color={C.accent}/><Badge label={n.importance} color={iC[n.importance]}/>{n.needFollowUp&&<Badge label="후속확인필요" color={C.yellow}/>}</div>
        {n.summary&&<div style={{fontSize:12,color:C.dim,lineHeight:1.5,marginBottom:6}}>{n.summary}</div>}
        {n.myJudge&&<div style={{fontSize:12,color:C.accent,fontStyle:"italic"}}>💡 {n.myJudge}</div>}
        {n.stocks?.length>0&&<div style={{display:"flex",gap:4,marginTop:6}}>{n.stocks.map(s=><Badge key={s} label={s} color={C.purple}/>)}</div>}
      </Card>)}
    </div>
    {form&&<div style={{width:340,flexShrink:0}}><Card style={{position:"sticky",top:0,maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:14}}>{editId?"뉴스 수정":"뉴스 추가"}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Inp label="날짜" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/><Inp label="출처" value={form.source} onChange={v=>setForm(f=>({...f,source:v}))} placeholder="WSJ, 한경..."/></div>
        <Inp label="기사 제목" value={form.title} onChange={v=>setForm(f=>({...f,title:v}))}/>
        <Txta label="요약/원문" value={form.summary} onChange={v=>setForm(f=>({...f,summary:v}))} rows={3}/>
        <Inp label="키워드 (쉼표 구분)" value={Array.isArray(form.keywords)?form.keywords.join(", "):form.keywords} onChange={v=>setForm(f=>({...f,keywords:v}))}/>
        <Inp label="관련 종목 (쉼표 구분)" value={Array.isArray(form.stocks)?form.stocks.join(", "):form.stocks} onChange={v=>setForm(f=>({...f,stocks:v}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Sel label="이슈 종류" value={form.issueType} onChange={v=>setForm(f=>({...f,issueType:v}))} options={["금리","CPI/PPI","고용","연준","지정학","정책","실적","수급","공매도","업황","환율","원자재","M&A"]}/><Sel label="중요도" value={form.importance} onChange={v=>setForm(f=>({...f,importance:v}))} options={["높음","중간","낮음"]}/></div>
        <Sel label="시장 영향" value={form.marketImpact} onChange={v=>setForm(f=>({...f,marketImpact:v}))} options={["미국증시 긍정","미국증시 부정","한국증시 긍정","한국증시 부정","특정 종목 긍정","중립"]}/>
        <Txta label="내 판단" value={form.myJudge} onChange={v=>setForm(f=>({...f,myJudge:v}))} rows={2} placeholder="포트폴리오 영향?"/>
        <label style={{display:"flex",alignItems:"center",gap:8,fontSize:12,color:C.dim,cursor:"pointer"}}><input type="checkbox" checked={form.needFollowUp} onChange={e=>setForm(f=>({...f,needFollowUp:e.target.checked}))}/>후속 확인 필요</label>
        <div style={{display:"flex",gap:8}}><Btn onClick={saveFn} style={{flex:1}}>저장</Btn>{editId&&<Btn variant="danger" onClick={()=>{del(editId);setForm(null);}}>삭제</Btn>}<Btn variant="ghost" onClick={()=>setForm(null)}>취소</Btn></div>
      </div>
    </Card></div>}
  </div>;
};

const CalendarTab=({data,setData})=>{
  const[form,setForm]=useState(null);const[editId,setEditId]=useState(null);const[mF,setMF]=useState(today().slice(0,7));
  const blank={date:today(),country:"미국",event:"",type:"경제지표",result:"",reaction:"",relatedStocks:"",portfolioImpact:"",importance:"중간"};
  const filtered=data.calendar.filter(e=>e.date.startsWith(mF)).sort((a,b)=>b.date.localeCompare(a.date));
  const openAdd=()=>{setForm({...blank});setEditId(null)};const openEdit=e=>{setForm({...e});setEditId(e.id)};
  const saveFn=()=>{if(editId)setData(d=>({...d,calendar:d.calendar.map(e=>e.id===editId?{...form,id:editId}:e)}));else setData(d=>({...d,calendar:[{...form,id:Date.now()},...d.calendar]}));setForm(null);setEditId(null);};
  const del=id=>setData(d=>({...d,calendar:d.calendar.filter(e=>e.id!==id)}));
  const tC={"통화정책":C.purple,"경제지표":C.cyan,"지정학":C.red,"실적":C.green,"정책":C.yellow};
  return<div style={{display:"flex",gap:16}}>
    <div style={{flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}><div style={{fontSize:15,fontWeight:700,color:C.text}}>이슈 캘린더</div><input type="month" value={mF} onChange={e=>setMF(e.target.value)} style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,padding:"4px 8px",color:C.text,fontSize:12}}/></div>
        <Btn onClick={openAdd}>+ 이벤트 추가</Btn>
      </div>
      {filtered.map(e=><Card key={e.id} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>openEdit(e)}>
        <div style={{fontWeight:700,fontSize:14,color:C.text}}>{e.event}</div>
        <div style={{display:"flex",gap:6,marginTop:6,flexWrap:"wrap"}}><Badge label={e.date} color={C.muted}/><Badge label={e.country} color={C.cyan}/><Badge label={e.type} color={tC[e.type]||C.accent}/><Badge label={e.importance} color={e.importance==="높음"?C.red:C.yellow}/></div>
        {e.result&&<div style={{marginTop:8,fontSize:12,color:C.dim}}><span style={{color:C.muted,fontWeight:600}}>결과: </span>{e.result}</div>}
        {e.reaction&&<div style={{fontSize:12,color:C.dim}}><span style={{color:C.muted,fontWeight:600}}>시장 반응: </span>{e.reaction}</div>}
        {e.portfolioImpact&&<div style={{fontSize:12,color:C.accent,marginTop:4}}>📌 내 포트폴리오: {e.portfolioImpact}</div>}
      </Card>)}
    </div>
    {form&&<div style={{width:340,flexShrink:0}}><Card style={{position:"sticky",top:0}}>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:14}}>{editId?"이벤트 수정":"이벤트 추가"}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Inp label="날짜" type="date" value={form.date} onChange={v=>setForm(f=>({...f,date:v}))}/><Sel label="국가" value={form.country} onChange={v=>setForm(f=>({...f,country:v}))} options={["미국","한국","유럽","중국","일본","기타"]}/></div>
        <Inp label="이벤트명" value={form.event} onChange={v=>setForm(f=>({...f,event:v}))}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Sel label="유형" value={form.type} onChange={v=>setForm(f=>({...f,type:v}))} options={["통화정책","경제지표","지정학","실적","정책","수급","기타"]}/><Sel label="중요도" value={form.importance} onChange={v=>setForm(f=>({...f,importance:v}))} options={["높음","중간","낮음"]}/></div>
        <Txta label="실제 결과" value={form.result} onChange={v=>setForm(f=>({...f,result:v}))} rows={2}/>
        <Txta label="시장 반응" value={form.reaction} onChange={v=>setForm(f=>({...f,reaction:v}))} rows={2}/>
        <Inp label="관련 종목/섹터" value={form.relatedStocks} onChange={v=>setForm(f=>({...f,relatedStocks:v}))}/>
        <Txta label="포트폴리오 영향" value={form.portfolioImpact} onChange={v=>setForm(f=>({...f,portfolioImpact:v}))} rows={2}/>
        <div style={{display:"flex",gap:8}}><Btn onClick={saveFn} style={{flex:1}}>저장</Btn>{editId&&<Btn variant="danger" onClick={()=>{del(editId);setForm(null);}}>삭제</Btn>}<Btn variant="ghost" onClick={()=>setForm(null)}>취소</Btn></div>
      </div>
    </Card></div>}
  </div>;
};

const Monthly=({data,setData})=>{
  const[form,setForm]=useState(null);const[editId,setEditId]=useState(null);
  const blank={month:today().slice(0,7),returnRate:0,realizedPnl:0,bestStock:"",worstStock:"",topNews:"",impactNews:"",bestTrades:"",badTrades:"",doMore:"",doLess:"",never:"",focusSector:"",watchList:""};
  const openAdd=()=>{setForm({...blank});setEditId(null)};const openEdit=r=>{setForm({...r});setEditId(r.id)};
  const saveFn=()=>{if(editId)setData(d=>({...d,monthlyReview:d.monthlyReview.map(r=>r.id===editId?{...form,id:editId}:r)}));else setData(d=>({...d,monthlyReview:[{...form,id:Date.now()},...d.monthlyReview]}));setForm(null);setEditId(null);};
  const del=id=>setData(d=>({...d,monthlyReview:d.monthlyReview.filter(r=>r.id!==id)}));
  return<div style={{display:"flex",gap:16}}>
    <div style={{flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:15,fontWeight:700,color:C.text}}>월간 리뷰</div><Btn onClick={openAdd}>+ 이번 달 리뷰</Btn></div>
      {data.monthlyReview.length===0&&<Card><div style={{textAlign:"center",padding:"40px 0",color:C.muted,fontSize:14}}>아직 월간 리뷰가 없어요. 매월 말 기록해두세요! 📅</div></Card>}
      {data.monthlyReview.map(r=><Card key={r.id} style={{marginBottom:12,cursor:"pointer"}} onClick={()=>openEdit(r)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:16,fontWeight:800,color:C.text}}>{r.month} 리뷰</div><div style={{fontSize:20,fontWeight:800,color:pnlColor(r.returnRate),fontFamily:"monospace"}}>{pct(+r.returnRate)}</div></div>
        {r.doMore&&<div style={{fontSize:12,color:C.green}}>✅ 더 할 것: {r.doMore}</div>}
        {r.never&&<div style={{fontSize:12,color:C.red}}>❌ 절대 하지 말 것: {r.never}</div>}
      </Card>)}
    </div>
    {form&&<div style={{width:360,flexShrink:0}}><Card style={{position:"sticky",top:0,maxHeight:"90vh",overflowY:"auto"}}>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:14}}>월간 리뷰 작성</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{fontSize:12,fontWeight:700,color:C.accent}}>A. 성과</div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Inp label="월" type="month" value={form.month} onChange={v=>setForm(f=>({...f,month:v}))}/><Inp label="수익률 (%)" type="number" value={form.returnRate} onChange={v=>setForm(f=>({...f,returnRate:+v}))}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Inp label="최고 종목" value={form.bestStock} onChange={v=>setForm(f=>({...f,bestStock:v}))}/><Inp label="최악 종목" value={form.worstStock} onChange={v=>setForm(f=>({...f,worstStock:v}))}/></div>
        <div style={{fontSize:12,fontWeight:700,color:C.accent}}>B. 뉴스 복기</div>
        <Txta label="가장 컸던 이슈" value={form.topNews} onChange={v=>setForm(f=>({...f,topNews:v}))} rows={3}/>
        <Txta label="포트폴리오 영향 뉴스" value={form.impactNews} onChange={v=>setForm(f=>({...f,impactNews:v}))} rows={2}/>
        <div style={{fontSize:12,fontWeight:700,color:C.accent}}>C. 매매 복기</div>
        <Txta label="가장 좋았던 진입" value={form.bestTrades} onChange={v=>setForm(f=>({...f,bestTrades:v}))} rows={3}/>
        <Txta label="가장 아쉬운 실수" value={form.badTrades} onChange={v=>setForm(f=>({...f,badTrades:v}))} rows={3}/>
        <div style={{fontSize:12,fontWeight:700,color:C.accent}}>D. 다음 달 원칙</div>
        <Txta label="더 할 것" value={form.doMore} onChange={v=>setForm(f=>({...f,doMore:v}))} rows={2}/>
        <Txta label="절대 하지 말 것" value={form.never} onChange={v=>setForm(f=>({...f,never:v}))} rows={2}/>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Inp label="집중 섹터" value={form.focusSector} onChange={v=>setForm(f=>({...f,focusSector:v}))}/><Inp label="관찰 종목" value={form.watchList} onChange={v=>setForm(f=>({...f,watchList:v}))}/></div>
        <div style={{display:"flex",gap:8}}><Btn onClick={saveFn} style={{flex:1}}>저장</Btn>{editId&&<Btn variant="danger" onClick={()=>{del(editId);setForm(null);}}>삭제</Btn>}<Btn variant="ghost" onClick={()=>setForm(null)}>취소</Btn></div>
      </div>
    </Card></div>}
  </div>;
};

const Master=({data,setData})=>{
  const[form,setForm]=useState(null);const[editId,setEditId]=useState(null);
  const blank={name:"",code:"",sector:"",industry:"",theme:"",keyPoint:"",competitor:"",sensitivity:"",checkIndicator:"",newsKeyword:""};
  const openAdd=()=>{setForm({...blank});setEditId(null)};const openEdit=s=>{setForm({...s});setEditId(s.id)};
  const saveFn=()=>{if(editId)setData(d=>({...d,stockMaster:d.stockMaster.map(s=>s.id===editId?{...form,id:editId}:s)}));else setData(d=>({...d,stockMaster:[{...form,id:Date.now()},...d.stockMaster]}));setForm(null);setEditId(null);};
  const del=id=>setData(d=>({...d,stockMaster:d.stockMaster.filter(s=>s.id!==id)}));
  return<div style={{display:"flex",gap:16}}>
    <div style={{flex:1}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontSize:15,fontWeight:700,color:C.text}}>종목 마스터 ({data.stockMaster.length}개)</div><Btn onClick={openAdd}>+ 종목 등록</Btn></div>
      {data.stockMaster.map(s=><Card key={s.id} style={{marginBottom:10,cursor:"pointer"}} onClick={()=>openEdit(s)}>
        <div style={{marginBottom:10}}><span style={{fontWeight:800,fontSize:15,color:C.text}}>{s.name}</span><span style={{fontSize:11,color:C.muted,marginLeft:8}}>{s.code}</span><div style={{display:"flex",gap:6,marginTop:6}}><Badge label={s.sector} color={C.cyan}/><Badge label={s.industry} color={C.purple}/>{s.theme.split(",").slice(0,2).map(t=><Badge key={t} label={t.trim()} color={C.accent}/>)}</div></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
          {[{l:"핵심 포인트",v:s.keyPoint},{l:"민감 변수",v:s.sensitivity},{l:"체크 지표",v:s.checkIndicator},{l:"뉴스 키워드",v:s.newsKeyword}].map(x=><div key={x.l} style={{background:"#060b17",borderRadius:8,padding:"8px 10px"}}><div style={{fontSize:10,color:C.muted,fontWeight:600,marginBottom:3}}>{x.l}</div><div style={{fontSize:11,color:C.dim,lineHeight:1.4}}>{x.v||"-"}</div></div>)}
        </div>
      </Card>)}
    </div>
    {form&&<div style={{width:340,flexShrink:0}}><Card style={{position:"sticky",top:0}}>
      <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:14}}>{editId?"종목 수정":"종목 등록"}</div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Inp label="종목명" value={form.name} onChange={v=>setForm(f=>({...f,name:v}))}/><Inp label="코드" value={form.code} onChange={v=>setForm(f=>({...f,code:v}))}/></div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}><Inp label="섹터" value={form.sector} onChange={v=>setForm(f=>({...f,sector:v}))}/><Inp label="산업" value={form.industry} onChange={v=>setForm(f=>({...f,industry:v}))}/></div>
        <Inp label="테마 (쉼표 구분)" value={form.theme} onChange={v=>setForm(f=>({...f,theme:v}))}/>
        <Txta label="핵심 포인트" value={form.keyPoint} onChange={v=>setForm(f=>({...f,keyPoint:v}))} rows={2}/>
        <Inp label="경쟁사" value={form.competitor} onChange={v=>setForm(f=>({...f,competitor:v}))}/>
        <Inp label="민감 변수" value={form.sensitivity} onChange={v=>setForm(f=>({...f,sensitivity:v}))}/>
        <Inp label="뉴스 키워드" value={form.newsKeyword} onChange={v=>setForm(f=>({...f,newsKeyword:v}))}/>
        <div style={{display:"flex",gap:8}}><Btn onClick={saveFn} style={{flex:1}}>저장</Btn>{editId&&<Btn variant="danger" onClick={()=>{del(editId);setForm(null);}}>삭제</Btn>}<Btn variant="ghost" onClick={()=>setForm(null)}>취소</Btn></div>
      </div>
    </Card></div>}
  </div>;
};

const AIInput=({data,setData})=>{
  const[raw,setRaw]=useState("");const[inputType,setInputType]=useState("직접입력");const[loading,setLoading]=useState(false);const[result,setResult]=useState(null);
  const sN=data.portfolio.map(p=>p.name);
  const analyze=async()=>{
    if(!raw.trim())return;setLoading(true);setResult(null);
    try{
      const pC=sN.join(", ");
      const prompt=`당신은 한국 주식 투자 정보 분류 AI입니다. 아래 텍스트를 분석하여 JSON만 응답하세요:
{"date":"YYYY-MM-DD","type":"뉴스|매매|이슈|메모","summary":"한줄 요약 30자 이내","keywords":["키워드1"],"relatedStocks":["관련종목"],"sector":"섹터","issueType":"금리|CPI/PPI|고용|연준|지정학|정책|실적|수급|업황|환율|기타","importance":"높음|중간|낮음","marketImpact":"한국증시 긍정|한국증시 부정|미국증시 긍정|미국증시 부정|특정 종목 긍정|중립","portfolioImpact":"포트폴리오(${pC})에 미치는 영향","action":"매수검토|매도검토|보유|관찰|없음"}
보유종목: ${pC} / 오늘: ${today()} / 분석텍스트: ${raw}`;
      const res=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,messages:[{role:"user",content:prompt}]})});
      const d=await res.json();
      const text=d.content?.map(c=>c.text||"").join("")||"";
      setResult(JSON.parse(text.replace(/```json|```/g,"").trim()));
    }catch(e){setResult({error:"분석 실패. 다시 시도해주세요."});}
    setLoading(false);
  };
  const saveToNews=()=>{
    if(!result||result.error)return;
    const item={id:Date.now(),date:result.date||today(),source:inputType,title:result.summary,summary:raw.slice(0,500),keywords:result.keywords||[],stocks:result.relatedStocks||[],sector:result.sector||"",issueType:result.issueType||"기타",importance:result.importance||"중간",marketImpact:result.marketImpact||"중립",myJudge:result.portfolioImpact||"",needFollowUp:result.importance==="높음"};
    setData(d=>({...d,news:[item,...d.news],aiInputs:[{id:Date.now(),date:today(),raw,type:inputType,result,processed:true},...d.aiInputs]}));
    setRaw("");setResult(null);alert("뉴스 아카이브에 저장되었습니다!");
  };
  const aC={"매수검토":C.green,"매도검토":C.red,"관찰":C.yellow,"보유":C.cyan,"없음":C.muted};
  return<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
    <div>
      <Card>
        <div style={{fontSize:15,fontWeight:700,color:C.text,marginBottom:14}}>🤖 AI 입력함</div>
        <div style={{fontSize:12,color:C.dim,marginBottom:14,lineHeight:1.6,padding:"10px 12px",background:"#060b17",borderRadius:8,borderLeft:`3px solid ${C.accent}`}}>뉴스 기사, 메모, 요약본 등 자유롭게 붙여넣으세요.<br/>AI가 자동 분류하고 포트폴리오와 연결합니다.</div>
        <div style={{display:"flex",flexDirection:"column",gap:12}}>
          <Sel label="입력 방식" value={inputType} onChange={setInputType} options={["직접입력","기사복붙","AI요약","음성변환","WSJ/NYT요약"]}/>
          <Txta label="정보 입력" value={raw} onChange={setRaw} rows={10} placeholder="뉴스, 메모, 요약본 등을 자유롭게 입력하세요..."/>
          <Btn onClick={analyze} style={{width:"100%",padding:"12px 0",fontSize:14}}>{loading?"AI 분석 중...":"🤖 AI 자동 분석"}</Btn>
        </div>
      </Card>
    </div>
    <div>
      {loading&&<Card style={{textAlign:"center",padding:"60px 0"}}><div style={{fontSize:32,marginBottom:12}}>🤖</div><div style={{color:C.dim}}>AI가 분석 중입니다...</div></Card>}
      {result&&!loading&&<Card>
        <div style={{fontSize:14,fontWeight:700,color:C.text,marginBottom:14}}>분석 결과</div>
        {result.error?<div style={{color:C.red}}>{result.error}</div>:<div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{padding:"12px 14px",background:"#060b17",borderRadius:10,borderLeft:`3px solid ${C.accent}`}}><div style={{fontSize:15,fontWeight:700,color:C.text}}>{result.summary}</div></div>
          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}><Badge label={result.date} color={C.muted}/><Badge label={result.issueType} color={C.accent}/><Badge label={result.importance} color={result.importance==="높음"?C.red:C.yellow}/><Badge label={`액션: ${result.action}`} color={aC[result.action]||C.muted}/></div>
          {result.relatedStocks?.length>0&&<div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{result.relatedStocks.map(s=><Badge key={s} label={s} color={C.green}/>)}</div>}
          {result.portfolioImpact&&<div style={{padding:"10px 12px",background:C.accent+"11",borderRadius:8,borderLeft:`3px solid ${C.accent}`}}><div style={{fontSize:11,color:C.accent,fontWeight:600,marginBottom:4}}>내 포트폴리오 영향</div><div style={{fontSize:12,color:C.dim,lineHeight:1.5}}>{result.portfolioImpact}</div></div>}
          <Btn onClick={saveToNews} style={{width:"100%",padding:"12px 0"}}>📰 뉴스 아카이브에 저장</Btn>
        </div>}
      </Card>}
      {!result&&!loading&&<Card style={{textAlign:"center",padding:"60px 20px"}}><div style={{fontSize:40,marginBottom:12}}>📥</div><div style={{color:C.dim,fontSize:14,lineHeight:1.6}}>왼쪽에 정보를 입력하고<br/>AI 분석 버튼을 누르세요.</div></Card>}
    </div>
  </div>;
};

const TABS=[{id:"dashboard",l:"대시보드",i:"⚡"},{id:"portfolio",l:"포트폴리오",i:"📊"},{id:"trades",l:"매매일지",i:"📝"},{id:"news",l:"뉴스아카이브",i:"📰"},{id:"calendar",l:"이슈캘린더",i:"📅"},{id:"monthly",l:"월간리뷰",i:"🗓"},{id:"master",l:"종목마스터",i:"🗂"},{id:"ai",l:"AI입력함",i:"🤖"}];

function App(){
  const[tab,setTab]=useState("dashboard");
  const[data,setData]=useState(null);
  useEffect(()=>{const d=load();setData(d||DEF);},[]);
  useEffect(()=>{if(data)save(data);},[data]);
  if(!data)return<div style={{background:C.bg,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",color:C.dim,fontSize:16}}>로딩 중...</div>;
  return<div style={{background:C.bg,minHeight:"100vh"}}>
    <div style={{borderBottom:`1px solid ${C.border}`,background:C.card,padding:"0 24px"}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",height:56}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:20}}>📈</span>
          <span style={{fontWeight:800,fontSize:16,color:C.text}}>Hannah's Stock OS</span>
          <span style={{fontSize:11,color:C.muted,background:C.accent+"22",padding:"2px 8px",borderRadius:20,border:`1px solid ${C.accent}44`}}>v1.0</span>
        </div>
        <div style={{fontSize:11,color:C.muted}}>{today()} · {data.portfolio.length}종목</div>
      </div>
      <div style={{display:"flex",gap:0,overflowX:"auto"}}>
        {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{background:"none",border:"none",cursor:"pointer",padding:"10px 14px",fontSize:12,fontWeight:600,color:tab===t.id?C.accent:C.muted,borderBottom:`2px solid ${tab===t.id?C.accent:"transparent"}`,whiteSpace:"nowrap"}}>{t.i} {t.l}</button>)}
      </div>
    </div>
    <div style={{padding:"20px 24px",maxWidth:1280,margin:"0 auto"}}>
      {tab==="dashboard"&&<Dashboard data={data}/>}
      {tab==="portfolio"&&<Portfolio data={data} setData={setData}/>}
      {tab==="trades"&&<Trades data={data} setData={setData}/>}
      {tab==="news"&&<News data={data} setData={setData}/>}
      {tab==="calendar"&&<CalendarTab data={data} setData={setData}/>}
      {tab==="monthly"&&<Monthly data={data} setData={setData}/>}
      {tab==="master"&&<Master data={data} setData={setData}/>}
      {tab==="ai"&&<AIInput data={data} setData={setData}/>}
    </div>
  </div>;
}
ReactDOM.createRoot(document.getElementById("root")).render(<App/>);
</script>
</body>
</html>
