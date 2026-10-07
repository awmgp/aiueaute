/*
  一等 学科試験 計算ドリル (計算問題対策)
  一等の学科試験では、教則の飛行原理(揚力・推力)や電波・運動の基礎公式に
  数値を当てはめて解く計算問題が例年出題される。頻出とされる代表的なパターンを
  ランダムな数値で繰り返し練習できるようにした独自ドリル(公式集を出典に自作)。
  g(重力加速度)=9.8 m/s^2、電波の速度 c=3×10^8 m/s として計算する。
*/
const G = 9.8;
const C_LIGHT = 3e8;

function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function round(v, d){
  const p = Math.pow(10,d);
  return Math.round((v + Number.EPSILON) * p) / p;
}
function fmt(v, d){ return round(v,d).toFixed(d); }

/* ---- 1. 旋回半径 r = V^2 / (g・tanΦ) ---- */
function genTurn(){
  const V = pick([10,12,15,18,20,24,25,30]);
  const deg = pick([15,20,30,36,45]);
  const rad = deg*Math.PI/180;
  const correct = V*V/(G*Math.tan(rad));
  const wrong1 = V/(G*Math.tan(rad));            // V^2ではなくVのまま計算
  const wrong2 = V*V/(G*Math.sin(rad));           // tanではなくsinを使用
  return {
    decimals: 1,
    prompt: `飛行速度 ${V} m/s、バンク角(傾斜角)${deg}° で定常旋回を行うとき、旋回半径として最も近いものはどれか。(g = 9.8 m/s²)`,
    steps: [
      `公式：旋回半径 r = V² ÷ (g・tanΦ)`,
      `r = ${V}² ÷ (9.8 × tan${deg}°)`,
      `r = ${round(V*V,1)} ÷ ${fmt(G*Math.tan(rad),3)}`,
      `r ≈ ${fmt(correct,1)} m`,
    ],
    correct, wrongs:[wrong1, wrong2],
  };
}

/* ---- 2. 電波のフレネルゾーン半径 R = √(λD/4)、λ = c/f ---- */
function genFresnel(){
  const fGHz = pick([1.2,2.4,5.7,5.8]);
  const Dkm = pick([1,2,3,5,10]);
  const lambda = C_LIGHT/(fGHz*1e9);   // m
  const Dm = Dkm*1000;
  const correct = Math.sqrt(lambda*Dm/4);
  const wrong1 = Math.sqrt(lambda*Dm);       // ÷4を忘れる
  const wrong2 = Math.sqrt(lambda*Dkm/4);    // kmのままmに換算し忘れる
  return {
    decimals: 2,
    prompt: `送受信アンテナ間の距離 ${Dkm} km、使用周波数 ${fGHz} GHz のとき、両アンテナ間の中間地点における第1フレネルゾーン半径として最も近いものはどれか。(電波速度 c = 3×10⁸ m/s)`,
    steps: [
      `公式：波長 λ = c ÷ f、フレネルゾーン半径 R = √(λD ÷ 4)`,
      `λ = (3×10⁸) ÷ (${fGHz}×10⁹) = ${fmt(lambda,4)} m`,
      `D = ${Dkm} km = ${Dm} m`,
      `R = √(${fmt(lambda,4)} × ${Dm} ÷ 4) ≈ ${fmt(correct,2)} m`,
    ],
    correct, wrongs:[wrong1, wrong2],
  };
}

/* ---- 3. 落下時の水平到達距離 x = V・√(2h/g) ---- */
function genFall(){
  const V = pick([15,18,20,25,30]);
  const h = pick([80,100,120,180,200,245,320,490]);
  const t = Math.sqrt(2*h/G);
  const correct = V*t;
  const t_wrong = Math.sqrt(h/G);           // 2を忘れる
  const wrong1 = V*t_wrong;
  const t_wrong2 = 2*h/G;                    // √を忘れる
  const wrong2 = V*t_wrong2;
  return {
    decimals: 1,
    prompt: `水平方向に ${V} m/s で飛行していた機体が、高度 ${h} m で揚力を失い自由落下を始めた。地面に到達するまでの水平到達距離として最も近いものはどれか。(g = 9.8 m/s²、空気抵抗は無視する)`,
    steps: [
      `公式：落下時間 t = √(2h ÷ g)、水平到達距離 x = V・t`,
      `t = √(2×${h} ÷ 9.8) ≈ ${fmt(t,2)} 秒`,
      `x = ${V} × ${fmt(t,2)} ≈ ${fmt(correct,1)} m`,
    ],
    correct, wrongs:[wrong1, wrong2],
  };
}

/* ---- 4. 揚力・推力の比例計算 ---- */
function genRatio(){
  const kinds = [
    {label:'固定翼機の揚力 L', law:'ρV²(飛行速度の2乗)', exp:2, varName:'飛行速度'},
    {label:'回転翼機の推力 T', law:'ρω²(回転角速度の2乗)', exp:2, varName:'回転角速度'},
    {label:'回転翼機の必要パワー P', law:'ρω³(回転角速度の3乗)', exp:3, varName:'回転角速度'},
  ];
  const kind = pick(kinds);
  const k = pick([1.1,1.2,1.25,1.5,2,0.8]);
  const correct = Math.pow(k, kind.exp);
  const wrong1 = k;                                         // 比例のべき乗を忘れて1乗のまま
  const otherExp = kind.exp===2 ? 3 : 2;
  const wrong2 = Math.pow(k, otherExp);                      // べき指数を取り違える
  return {
    decimals: 2,
    prompt: `${kind.label}は${kind.law}に比例する。${kind.varName}が${k}倍になったとき、${kind.label.slice(-1)}は元の何倍になるか。`,
    steps: [
      `公式：${kind.label} ∝ ${kind.law}`,
      `${kind.varName}が${k}倍 → ${kind.label.slice(-1)}は (${k})^${kind.exp} 倍`,
      `= ${fmt(correct,2)} 倍`,
    ],
    correct, wrongs:[wrong1, wrong2],
    unitOverride:'倍',
  };
}

/* ---- 5. バッテリー飛行時間 ---- */
function genBattery(){
  const cap = pick([3000,4000,5000,6000,8000]);   // mAh
  const usable = pick([70,75,80,85]);              // %
  const cur = pick([8,10,12,15,18,20]);            // A
  const correct = (cap/1000 * usable/100)/cur*60;  // 分
  const wrong1 = (cap/1000)/cur*60;                 // 使用可能割合を掛け忘れる
  const wrong2 = (cap * usable/100)/cur*60;         // mAh→Ahの換算(÷1000)を忘れる
  return {
    decimals: 1,
    prompt: `バッテリー容量 ${cap} mAh、安全のため使用可能な容量をその ${usable}%、飛行中の平均消費電流を ${cur} A とするとき、飛行可能時間として最も近いものはどれか。`,
    steps: [
      `公式：飛行時間(分) = (容量[Ah] × 使用可能割合) ÷ 消費電流[A] × 60`,
      `容量 = ${cap} mAh = ${cap/1000} Ah、使用可能量 = ${cap/1000} × ${usable}% = ${fmt(cap/1000*usable/100,2)} Ah`,
      `飛行時間 = ${fmt(cap/1000*usable/100,2)} ÷ ${cur} × 60 ≈ ${fmt(correct,1)} 分`,
    ],
    correct, wrongs:[wrong1, wrong2],
  };
}

const CALC_TYPES = [
  {id:'turn',     name:'旋回半径',        unit:'m', gen:genTurn},
  {id:'fresnel',  name:'電波(フレネルゾーン)半径', unit:'m', gen:genFresnel},
  {id:'fall',     name:'落下時の到達距離', unit:'m', gen:genFall},
  {id:'ratio',    name:'揚力・推力の比例計算', unit:'倍', gen:genRatio},
  {id:'battery',  name:'バッテリー飛行時間', unit:'分', gen:genBattery},
];

// 直前の問題と同じ位置(1〜3番目)に正解が連続しないようにする
let lastCalcAnswerIndex = -1;

// 生成した3択の数値が丸め後に重複しないよう、最大30回まで作り直す
function buildCalcProblem(typeId){
  const type = CALC_TYPES.find(t=>t.id===typeId) || pick(CALC_TYPES);
  let raw, choiceStrs, tries=0;
  do{
    raw = type.gen();
    const d = raw.decimals;
    choiceStrs = [raw.correct, ...raw.wrongs].map(v=>fmt(v,d));
    tries++;
  } while(new Set(choiceStrs).size < 3 && tries < 30);

  const unit = raw.unitOverride || type.unit;

  // 正解の位置を、前回とは異なる位置からランダムに選ぶ
  const candidatePositions = [0,1,2].filter(p => p !== lastCalcAnswerIndex);
  const answerIndex = candidatePositions[Math.floor(Math.random()*candidatePositions.length)];
  lastCalcAnswerIndex = answerIndex;

  // 誤答2つをどちらの残り枠に入れるかもランダム化
  const wrongOrder = Math.random() < 0.5 ? [0,1] : [1,0];
  const remainingSlots = [0,1,2].filter(p => p !== answerIndex);
  const choices = new Array(3);
  choices[answerIndex] = `${choiceStrs[0]} ${unit}`;
  choices[remainingSlots[0]] = `${choiceStrs[1+wrongOrder[0]]} ${unit}`;
  choices[remainingSlots[1]] = `${choiceStrs[1+wrongOrder[1]]} ${unit}`;

  return {
    typeId: type.id,
    typeName: type.name,
    prompt: raw.prompt,
    steps: raw.steps,
    choices,
    answerIndex,
  };
}
