import Head from 'next/head'
import { useState, useRef, useEffect, useCallback } from 'react'

var CREAM = '#FDFAF5'
var INK = '#12202E'
var RED = '#C8102E'
var GOLD = '#E8A020'
var TEAL = '#0B6E6E'
var BLUE = '#1A3A5C'
var MIST = '#EBE5DA'
var FOG = '#D4C9B8'
var SMOKE = '#8A7E70'
var WHITE = '#FFFFFF'
var GOLD_LIGHT = '#FDF0D5'
var GREEN = '#2D6A4F'
var BROWN = '#7A3010'

var THEMES_ES = [
  'La Transición española (1975-1982)',
  'La mémoire historique et la Loi de mémoire démocratique',
  'Le nationalisme catalan et les tensions territoriales',
  'L\'immigration en Espagne (Ceuta, Melilla, Canaries)',
  'Le féminisme et le mouvement 8-M en Espagne',
  'La démocratie espagnole : Vox, Podemos et la fragmentation',
  'La jeunesse espagnole : précarité et désillusion',
  'La monarchie espagnole et la crise institutionnelle',
]
var PAYS_AM = [
  { pays: 'Mexique', th: 'narcotrafic, féminicides, Claudia Sheinbaum' },
  { pays: 'Argentine', th: 'Milei, ultralibéralisme, inflation, péronisme' },
  { pays: 'Venezuela', th: 'Maduro, autoritarisme, exode migratoire' },
  { pays: 'Colombie', th: 'accord de paix FARC, Petro, narcotrafic' },
  { pays: 'Cuba', th: 'post-Castro, embargo, pénuries, dissidence' },
  { pays: 'Chili', th: 'héritage Pinochet, Boric, Constitution, cuivre' },
  { pays: 'Bolivie', th: 'Evo Morales, lithium, nationalisme' },
  { pays: 'Amérique latine', th: 'populismes, féminisme, peuples autochtones' },
]
var THEMES_GEO = [
  'Les relations USA – Amérique latine',
  'La Chine en Amérique latine',
  'L\'Espagne et le Maroc : immigration et Sahara occidental',
  'La géopolitique du lithium',
  'La démocratie en crise dans le monde hispanique',
]
var THEMES_SOC = [
  'Le tourisme de masse (Barcelone, Canaries, Baléares)',
  'La transition écologique en Espagne',
  'Le soft power hispanique : langue, séries, musique',
  'Le reggaeton et la musique latine mondiale',
]
var GRAM = [
  { id: 'subj_pres', label: 'Le subjonctif présent' },
  { id: 'subj_imp', label: 'Le subjonctif imparfait' },
  { id: 'concordance', label: 'La concordance des temps' },
  { id: 'imp_pret', label: 'L\'imparfait vs le prétérit' },
  { id: 'conditionnel', label: 'Le conditionnel' },
  { id: 'serstar', label: 'Ser vs Estar' },
  { id: 'porpara', label: 'Por vs Para' },
  { id: 'periphrase', label: 'Les périphrases verbales' },
  { id: 'passif', label: 'Le passif' },
  { id: 'relatifs', label: 'Les pronoms relatifs' },
]
var ELVI_LVA = { doc_es: '~1 500', doc_fr: '~400', theme: '~200', resume: '350', essai: '600', oral: '600-650' }
var ELVI_LVB = { doc_es: '~1 200', doc_fr: '~300', theme: '~150', resume: '250', essai: '400', oral: '500-550' }
var MODS = [
  { id: 'dossier',    emoji: '📰', num: '01', label: 'Dossiers',   tag: 'ELVI · Ecricome · BCE',         color: RED   },
  { id: 'traduction', emoji: '🔄', num: '02', label: 'Traduction', tag: 'Thème · Version · Grammaire',   color: TEAL  },
  { id: 'grammaire',  emoji: '📖', num: '03', label: 'Grammaire',  tag: 'Cours + exemples hispaniques',  color: BLUE  },
  { id: 'fiche',      emoji: '📚', num: '04', label: 'Fiches',     tag: 'Civilisation · Vocabulaire',    color: BROWN },
  { id: 'oral',       emoji: '🎤', num: '05', label: 'Oral',       tag: 'Khôlle vocale · IA examinateur',color: GREEN },
]
var SYS_BASE = 'Tu es un professeur agrégé d\'espagnol, spécialiste CPGE. Tu maîtrises la civilisation hispanique et les concours ELVI LVA/LVB, BCE et Ecricome. Critères ELVI LVA : docs ES ~1500 mots, doc FR ~400 mots, résumé 350 mots, essai 600 mots, thème ~200 mots. Critères LVB : docs ES ~1200 mots, doc FR ~300 mots, résumé 250 mots, essai 400 mots.'

var ANIMATIONS = [
  '@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}',
  '@keyframes spin{to{transform:rotate(360deg)}}',
  '@keyframes pulse{0%,100%{opacity:1}50%{opacity:.25}}',
  '@keyframes bar{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}',
  '@keyframes glow{0%,100%{box-shadow:0 0 18px rgba(200,16,46,.3)}50%{box-shadow:0 0 40px rgba(200,16,46,.7)}}',
  '@keyframes ripple{0%{transform:scale(1);opacity:.4}100%{transform:scale(2.8);opacity:0}}',
  '@keyframes msgIn{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}',
].join(' ')

var BASE_CSS = [
  '.btn{transition:all .15s;cursor:pointer;border:none;outline:none}',
  '.btn:hover:not(:disabled){transform:translateY(-2px) scale(1.02)}',
  '.btn:active{transform:scale(.95)!important}',
  '.card{transition:box-shadow .2s}',
  '.card:hover{box-shadow:0 10px 36px rgba(18,32,46,.11)!important}',
  '.tab{transition:all .2s;cursor:pointer;border:none;outline:none;background:none}',
  '.out{animation:fadeUp .4s ease}',
  '.msg{animation:msgIn .3s ease}',
  'textarea:focus,input:focus,select:focus{outline:2px solid #E8A020;outline-offset:2px;border-color:#E8A020!important}',
].join(' ')

var ALL_CSS = ANIMATIONS + BASE_CSS

async function callClaude(system, messages) {
  var r = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ system: system, messages: messages }),
  })
  var d = await r.json()
  if (d.error) throw new Error(d.error)
  return d.text
}

async function transcribeBackend(blob) {
  var fd = new FormData()
  var ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm'
  fd.append('file', blob, 'audio.' + ext)
  fd.append('model', 'whisper-large-v3-turbo')
  fd.append('language', 'es')
  fd.append('response_format', 'text')
  var r = await fetch('/api/transcribe', { method: 'POST', body: fd })
  var d = await r.json()
  if (d.error) throw new Error(d.error)
  return d.text
}

function getThemeList(aire) {
  if (aire === 'geopolitique') return THEMES_GEO
  if (aire === 'societe') return THEMES_SOC
  return THEMES_ES
}

function getElvi(lv) {
  return lv === 'LVB' ? ELVI_LVB : ELVI_LVA
}

function getActiveMod(mod) {
  for (var i = 0; i < MODS.length; i++) {
    if (MODS[i].id === mod) return MODS[i]
  }
  return MODS[0]
}

// ── APP ───────────────────────────────────────────────────────────
export default function PrepIA() {
  var [mod, setMod] = useState('dossier')
  var [out, setOut] = useState('')
  var [busy, setBusy] = useState(false)
  var [err, setErr] = useState('')
  var [lv, setLv] = useState('LVA')
  var [conc, setConc] = useState('ELVI/BCE')
  var active = getActiveMod(mod)

  async function run(sys, user) {
    setBusy(true)
    setOut('')
    setErr('')
    try {
      var result = await callClaude(sys, [{ role: 'user', content: user }])
      setOut(result)
    } catch (e) {
      setErr(e.message)
    }
    setBusy(false)
  }

  function switchMod(newMod) {
    setMod(newMod)
    setOut('')
    setErr('')
  }

  return (
    <>
      <Head>
        <title>PrepIA Español — CPGE</title>
        <meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover" />
      </Head>
      <div style={{ minHeight: '100vh', background: CREAM, fontFamily: "'DM Sans',sans-serif", color: INK }}>
        <style>{ALL_CSS}</style>

        {/* HEADER */}
        <header style={{ background: INK, padding: '0 20px', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 20px rgba(0,0,0,.25)' }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg,#C8102E,#E8A020)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>🇪🇸</div>
              <div>
                <h1 style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: '1.2rem', color: WHITE, margin: 0 }}>PrepIA</h1>
                <p style={{ fontSize: '.56rem', color: 'rgba(255,255,255,.4)', margin: 0, letterSpacing: '2px', textTransform: 'uppercase' }}>Español CPGE</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 4, background: 'rgba(255,255,255,.08)', borderRadius: 999, padding: 3 }}>
              {['LVA', 'LVB'].map(function(l) {
                return (
                  <button key={l} className="btn" onClick={function() { setLv(l) }} style={{ padding: '5px 15px', borderRadius: 999, background: lv === l ? GOLD : 'transparent', color: lv === l ? INK : 'rgba(255,255,255,.5)', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: '.78rem', cursor: 'pointer' }}>
                    {l}
                  </button>
                )
              })}
            </div>
            <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '4px 11px', fontSize: '.66rem', color: 'rgba(255,255,255,.4)' }}>
              🎤 PrepIA Oral
            </div>
          </div>
        </header>

        {/* NAV */}
        <nav style={{ background: WHITE, borderBottom: '2px solid ' + MIST, position: 'sticky', top: 58, zIndex: 99 }}>
          <div style={{ maxWidth: 1120, margin: '0 auto', padding: '0 16px', display: 'flex', overflowX: 'auto' }}>
            {MODS.map(function(m) {
              var isActive = mod === m.id
              return (
                <button key={m.id} className="tab" onClick={function() { switchMod(m.id) }} style={{ padding: '12px 16px', borderBottom: '3px solid ' + (isActive ? m.color : 'transparent'), display: 'flex', alignItems: 'center', gap: 7, whiteSpace: 'nowrap', opacity: isActive ? 1 : 0.6 }}>
                  <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: '.68rem', color: isActive ? m.color : SMOKE, letterSpacing: '1px' }}>{m.num}</span>
                  <span style={{ fontSize: '.9rem' }}>{m.emoji}</span>
                  <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: isActive ? 600 : 400, fontSize: '.84rem', color: isActive ? m.color : SMOKE }}>{m.label}</span>
                  {isActive && <span style={{ fontSize: '.64rem', color: m.color, background: m.color + '18', borderRadius: 999, padding: '2px 7px', fontWeight: 500 }}>{m.tag}</span>}
                </button>
              )
            })}
          </div>
        </nav>

        {/* MAIN */}
        <main style={{ maxWidth: 1120, margin: '0 auto', padding: '22px 18px 60px' }}>
          {/* Bandeau module */}
          <div className="out" style={{ display: 'flex', alignItems: 'center', gap: 13, marginBottom: 20, padding: '14px 20px', background: active.color + '15', borderRadius: 14, border: '1px solid ' + active.color + '25' }}>
            <div style={{ width: 44, height: 44, background: 'linear-gradient(135deg,' + active.color + ',' + active.color + 'AA)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{active.emoji}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: '1.1rem', color: active.color, margin: 0 }}>{active.label}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.75rem', color: SMOKE, margin: '2px 0 0', fontStyle: 'italic' }}>{active.tag} · Niveau {lv}</p>
            </div>
            <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: '2.8rem', color: active.color + '12', lineHeight: 1, userSelect: 'none' }}>{active.num}</div>
          </div>

          {/* Grille formulaire + résultat */}
          {mod !== 'oral' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px,380px) 1fr', gap: 18 }}>
              <div className="card" style={{ background: WHITE, borderRadius: 18, border: '1.5px solid ' + MIST, overflow: 'hidden', boxShadow: '0 4px 18px rgba(18,32,46,.07)' }}>
                <div style={{ height: 4, background: 'linear-gradient(90deg,' + active.color + ',' + active.color + '80)' }} />
                <div style={{ padding: 18 }}>
                  {mod === 'dossier' && <DossierForm run={run} busy={busy} lv={lv} conc={conc} setConc={setConc} color={active.color} />}
                  {mod === 'traduction' && <TradForm run={run} busy={busy} lv={lv} out={out} setOut={setOut} err={err} setErr={setErr} color={active.color} />}
                  {mod === 'grammaire' && <GramForm run={run} busy={busy} lv={lv} color={active.color} />}
                  {mod === 'fiche' && <FicheForm run={run} busy={busy} color={active.color} />}
                </div>
              </div>
              <ResultPanel out={out} busy={busy} err={err} color={active.color} />
            </div>
          )}
          {mod === 'oral' && <OralModule lv={lv} conc={conc} setConc={setConc} />}
        </main>
      </div>
    </>
  )
}

function ResultPanel(props) {
  var out = props.out
  var busy = props.busy
  var err = props.err
  var color = props.color
  return (
    <div className="card" style={{ background: WHITE, borderRadius: 18, border: '1.5px solid ' + MIST, overflow: 'hidden', boxShadow: '0 4px 18px rgba(18,32,46,.07)', minHeight: 460, display: 'flex', flexDirection: 'column' }}>
      <div style={{ height: 4, background: 'linear-gradient(90deg,' + color + '40,' + color + '10)' }} />
      <div style={{ padding: '13px 18px', borderBottom: '1px solid ' + MIST, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: '.9rem', color: INK }}>Résultat</span>
        {out && !busy && (
          <button className="btn" onClick={function() { navigator.clipboard.writeText(out) }} style={{ background: color + '15', border: '1px solid ' + color + '40', borderRadius: 999, padding: '4px 12px', fontSize: '.68rem', fontFamily: "'DM Sans',sans-serif", fontWeight: 600, color: color, cursor: 'pointer' }}>📋 Copier</button>
        )}
      </div>
      <div style={{ padding: 18, flex: 1, overflowY: 'auto' }}>
        {busy && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 260, gap: 14 }}>
            <div style={{ width: 36, height: 36, border: '3px solid ' + color + '20', borderTop: '3px solid ' + color, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', color: SMOKE, fontSize: '.86rem', animation: 'pulse 1.5s infinite', margin: 0 }}>Génération en cours…</p>
          </div>
        )}
        {err && <div style={{ background: '#FFF3F3', border: '1.5px solid #C8102E40', borderRadius: 10, padding: '10px 14px', fontFamily: "'DM Sans',sans-serif", color: RED, fontSize: '.84rem' }}>⚠️ {err}</div>}
        {!busy && !err && out && <div className="out" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.87rem', lineHeight: 1.85, color: INK, whiteSpace: 'pre-wrap' }}>{out}</div>}
        {!busy && !err && !out && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', minHeight: 280, gap: 10, opacity: 0.3 }}>
            <div style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, fontSize: '4rem', color: FOG }}>¿?</div>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.88rem', color: SMOKE, textAlign: 'center', margin: 0 }}>Configure le formulaire et lance la génération</p>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Composants UI de base ─────────────────────────────────────────
function Label(props) {
  return (
    <div style={{ marginBottom: 13 }}>
      <label style={{ display: 'block', fontFamily: "'DM Sans',sans-serif", fontSize: '.66rem', textTransform: 'uppercase', letterSpacing: '1.8px', color: SMOKE, marginBottom: 6, fontWeight: 700 }}>{props.label}</label>
      {props.children}
    </div>
  )
}

function SelectField(props) {
  return (
    <select value={props.value} onChange={function(e) { props.onChange(e.target.value) }} style={{ width: '100%', background: CREAM, border: '1.5px solid ' + MIST, borderRadius: 9, padding: '9px 36px 9px 12px', fontFamily: "'DM Sans',sans-serif", fontSize: '.86rem', color: INK, outline: 'none', cursor: 'pointer', WebkitAppearance: 'none', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%238A7E70' stroke-width='1.8' fill='none'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
      {props.children}
    </select>
  )
}

function InputField(props) {
  return (
    <input value={props.value} onChange={function(e) { props.onChange(e.target.value) }} placeholder={props.placeholder || ''} style={{ width: '100%', background: CREAM, border: '1.5px solid ' + MIST, borderRadius: 9, padding: '9px 12px', fontFamily: "'DM Sans',sans-serif", fontSize: '.86rem', color: INK, outline: 'none' }} />
  )
}

function ChipGroup(props) {
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {props.vals.map(function(v) {
        var isActive = props.active === v
        return (
          <button key={v} className="btn" onClick={function() { props.set(v) }} style={{ padding: '6px 11px', background: isActive ? props.color : CREAM, color: isActive ? WHITE : SMOKE, border: '1.5px solid ' + (isActive ? props.color : MIST), borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: '.75rem', fontWeight: isActive ? 600 : 400, cursor: 'pointer' }}>{v}</button>
        )
      })}
    </div>
  )
}

function AireSelect(props) {
  var options = [['espagne', '🇪🇸 Espagne'], ['amerique', '🌎 Amér. latine'], ['geopolitique', '🌍 Géopolitique'], ['societe', '🌱 Société']]
  return (
    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
      {options.map(function(opt) {
        var v = opt[0]
        var l = opt[1]
        var isActive = props.aire === v
        return (
          <button key={v} className="btn" onClick={function() { props.setAire(v) }} style={{ padding: '6px 11px', background: isActive ? props.color : CREAM, color: isActive ? WHITE : SMOKE, border: '1.5px solid ' + (isActive ? props.color : MIST), borderRadius: 999, fontFamily: "'DM Sans',sans-serif", fontSize: '.75rem', fontWeight: isActive ? 600 : 400, cursor: 'pointer' }}>{l}</button>
        )
      })}
    </div>
  )
}

function InfoBadge(props) {
  return (
    <div style={{ background: props.color + '0F', border: '1px solid ' + props.color + '30', borderRadius: 9, padding: '8px 12px' }}>
      <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.75rem', color: props.color, margin: 0, lineHeight: 1.5 }}>{props.children}</p>
    </div>
  )
}

function GoButton(props) {
  var off = props.busy || props.disabled
  return (
    <button className="btn" onClick={props.onClick} disabled={off} style={{ width: props.flex ? undefined : '100%', flex: props.flex ? 1 : undefined, padding: '12px 16px', borderRadius: 11, border: 'none', background: off ? MIST : 'linear-gradient(135deg,' + props.color + ',' + props.color + 'CC)', color: off ? FOG : WHITE, fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: '.93rem', cursor: off ? 'not-allowed' : 'pointer', boxShadow: off ? 'none' : '0 4px 14px ' + props.color + '40' }}>
      {props.busy ? '⏳ Génération…' : props.children}
    </button>
  )
}

// ── Module 1 — Dossiers ───────────────────────────────────────────
function DossierForm(props) {
  var run = props.run
  var busy = props.busy
  var lv = props.lv
  var conc = props.conc
  var setConc = props.setConc
  var color = props.color

  var [aire, setAire] = useState('espagne')
  var [theme, setTheme] = useState(THEMES_ES[0])
  var [pays, setPays] = useState(PAYS_AM[0].pays)
  var [angle, setAngle] = useState('')

  var list = getThemeList(aire)
  var paysData = PAYS_AM.find(function(p) { return p.pays === pays })
  var sujet = aire === 'espagne' ? theme : aire === 'amerique' ? pays + ' — ' + (paysData ? paysData.th.split(',')[0] : '') : theme
  var c = getElvi(lv)

  function goDossier() {
    var angleStr = angle ? ' | Angle : "' + angle + '"' : ''
    var wES1 = lv === 'LVA' ? '750-800' : '600-650'
    var wES2 = lv === 'LVA' ? '700-750' : '550-600'
    var prompt = 'Génère un sujet ELVI COMPLET format annales officielles. Concours : ' + conc + ' ' + lv + ' | Thème : "' + sujet + '"' + angleStr + '\n\n'
    prompt += 'CONTRAINTES ABSOLUES :\n'
    prompt += '- Sources datées entre 2025 et 2026 UNIQUEMENT\n'
    prompt += '- Articles COMPLETS avec vrais paragraphes (pas de résumés ni de crochets indicatifs)\n'
    prompt += '- Consignes Q1 et Q2 rédigées en español style officiel ELVI\n'
    prompt += '- Format typographique exact comme ci-dessous\n\n'
    prompt += '════════════════════════════════════\n'
    prompt += 'BANQUE ELVI — ' + conc + ' — ESPAGNOL ' + lv + '\n'
    prompt += 'SESSION 2026 | Thème : ' + sujet + '\n'
    prompt += '════════════════════════════════════\n\n'
    prompt += 'DOCUMENTO 1\n'
    prompt += 'Título : [titre accrocheur en español]\n'
    prompt += 'Autor : [prénom nom fictif]\n'
    prompt += 'Fuente : [elDiario.es OU El País OU La Vanguardia OU El Mundo OU elconfidencial.com]\n'
    prompt += 'Fecha : [date entre enero 2025 y abril 2026]\n\n'
    prompt += '[Rédige ici l\'article COMPLET en español — exactement ' + wES1 + ' mots — style journalistique soutenu — vrais paragraphes développés — NE PAS résumer]\n\n'
    prompt += '————————————————————————————————————\n\n'
    prompt += 'DOCUMENTO 2\n'
    prompt += 'Título : [titre différent, angle différent]\n'
    prompt += 'Autor : [autre prénom nom fictif]\n'
    prompt += 'Fuente : [source DIFFÉRENTE du doc 1 — elDiario.es OU El País OU infoLibre OU La Jornada OU El Periódico]\n'
    prompt += 'Fecha : [date entre enero 2025 y abril 2026]\n\n'
    prompt += '[Rédige ici l\'article COMPLET en español — exactement ' + wES2 + ' mots — angle et perspective DIFFÉRENTS du doc 1 — vrais paragraphes]\n\n'
    prompt += '————————————————————————————————————\n\n'
    prompt += 'DOCUMENTO 3\n'
    prompt += 'Título : [titre en français]\n'
    prompt += 'Autor : [prénom nom fictif]\n'
    prompt += 'Fuente : [Le Monde OU Le Figaro OU Libération OU L\'Obs OU Le Point]\n'
    prompt += 'Fecha : [date entre janvier 2025 et avril 2026]\n\n'
    prompt += '[Rédige ici l\'article COMPLET en français — exactement ' + c.doc_fr + ' mots — style journalistique. Indique entre crochets [ ] l\'extrait à traduire : ~' + c.theme + ' mots consécutifs dans le texte]\n\n'
    prompt += '════════════════════════════════════\n'
    prompt += 'PREGUNTAS\n'
    prompt += '════════════════════════════════════\n\n'
    prompt += 'PREGUNTA 1 — Resumen analítico comparativo (' + c.resume + ' palabras)\n'
    prompt += '¿Cómo se presentan [aspect central du thème] en los documentos 1 y 2? Redacte un resumen analítico comparativo de ' + c.resume + ' palabras.\n\n'
    prompt += 'PREGUNTA 2 — Ensayo argumentado (' + c.essai + ' palabras)\n'
    prompt += '¿Le parece que [question problématisée sur le thème]? Conteste teniendo en cuenta todos los documentos del dosier y apoyándose en su reflexión y en sus conocimientos personales. (' + c.essai + ' palabras)\n\n'
    prompt += 'PREGUNTA 3 — Traducción (tema)\n'
    prompt += 'Traduzca al español el fragmento del documento 3 entre corchetes [ ] (~' + c.theme + ' palabras).'
    run(SYS_BASE, prompt)
  }

  function goCorrige() {
    var prompt = 'Génère les CORRIGÉS OFFICIELS complets pour un sujet ELVI. Concours : ' + conc + ' ' + lv + ' | Thème : "' + sujet + '"\n\n'
    prompt += '════════════════════════════════════\n'
    prompt += 'CORRIGÉS PROFESSEUR — ELVI ' + lv + ' — ' + conc + '\n'
    prompt += '════════════════════════════════════\n\n'
    prompt += 'CORRIGÉ Q1 — Resumen analítico comparativo (' + c.resume + ' palabras)\n\n'
    prompt += 'Rédige en español un corrigé-type COMPLET :\n'
    prompt += '- Introduction : idée directrice commune aux deux documents + annonce des divergences\n'
    prompt += '- Développement : 2-3 points articulés avec références précises aux doc 1 et doc 2\n'
    prompt += '- Conclusion : synthèse comparative\n'
    prompt += 'Respecter EXACTEMENT ' + c.resume + ' mots. Rédige le texte complet.\n\n'
    prompt += '————————————————————————————————————\n\n'
    prompt += 'CORRIGÉ Q2 — Ensayo argumentado (' + c.essai + ' palabras)\n\n'
    prompt += 'Rédige en español un corrigé-type COMPLET :\n'
    prompt += '- Introduction avec problématique et annonce du plan\n'
    prompt += '- 2 parties avec sous-parties, exemples des documents ET exemples personnels de civilisation hispanique\n'
    prompt += '- Conclusion\n'
    prompt += 'Respecter EXACTEMENT ' + c.essai + ' mots. Rédige le texte complet.\n\n'
    prompt += '————————————————————————————————————\n\n'
    prompt += 'CORRIGÉ Q3 — Traducción thème (~' + c.theme + ' mots)\n\n'
    prompt += 'Propose une traduction de référence en español soutenu niveau ' + lv + '.\n'
    prompt += 'Puis : 5 points de grammaire clés avec exemples tirés de la traduction (subjonctif, ser/estar, temps du passé, concordance, registre).'
    run(SYS_BASE, prompt)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Label label="Aire thématique"><AireSelect aire={aire} setAire={setAire} color={color} /></Label>
      {aire === 'amerique' ? (
        <Label label="Pays"><SelectField value={pays} onChange={setPays}>{PAYS_AM.map(function(p) { return <option key={p.pays}>{p.pays}</option> })}</SelectField></Label>
      ) : (
        <Label label="Thème"><SelectField value={theme} onChange={setTheme}>{list.map(function(t) { return <option key={t}>{t}</option> })}</SelectField></Label>
      )}
      <Label label="Concours"><ChipGroup vals={['ELVI/BCE', 'Ecricome']} active={conc} set={setConc} color={color} /></Label>
      <Label label="Angle précis (optionnel)"><InputField value={angle} onChange={setAngle} placeholder="Ex : rôle des femmes, dimension économique…" /></Label>
      <InfoBadge color={color}>📏 {lv} · docs ES {c.doc_es} mots · doc FR {c.doc_fr} · résumé {c.resume} · essai {c.essai}</InfoBadge>
      <GoButton onClick={goDossier} busy={busy} color={color}>📰 Générer le dossier ELVI</GoButton>
      <GoButton onClick={goCorrige} busy={busy} color="#2D6A4F">✅ Générer les corrigés Q1+Q2+Q3</GoButton>
    </div>
  )
}


// ── Module 2 — Traduction ─────────────────────────────────────────
var TTABS = [
  { id: 'tl', l: 'Thème LVA', d: 'theme', v: 'LVA' },
  { id: 'tb', l: 'Thème LVB', d: 'theme', v: 'LVB' },
  { id: 'vl', l: 'Version LVA', d: 'version', v: 'LVA' },
  { id: 'vb', l: 'Version LVB', d: 'version', v: 'LVB' },
  { id: 'gr', l: 'Série gramm.', d: 'gram', v: '' },
]

function TradForm(props) {
  var run = props.run
  var busy = props.busy
  var out = props.out
  var setOut = props.setOut
  var err = props.err
  var setErr = props.setErr
  var color = props.color

  var [tab, setTab] = useState('tl')
  var [aire, setAire] = useState('espagne')
  var [theme, setTheme] = useState(THEMES_ES[0])
  var [pays, setPays] = useState(PAYS_AM[0].pays)
  var [conc, setConc] = useState('ELVI/BCE')
  var [pt, setPt] = useState(GRAM[0].id)
  var [gen, setGen] = useState('')
  var [ans, setAns] = useState('')
  var [step, setStep] = useState('config')
  var [prevOut, setPrevOut] = useState('')

  var cur = null
  for (var i = 0; i < TTABS.length; i++) { if (TTABS[i].id === tab) { cur = TTABS[i]; break } }
  var isGram = tab === 'gr'
  var list = getThemeList(aire)
  var paysData = PAYS_AM.find(function(p) { return p.pays === pays })
  var sujet = aire === 'espagne' ? theme : aire === 'amerique' ? pays + ' — ' + (paysData ? paysData.th.split(',')[0] : '') : theme

  if (step === 'tx' && out && out !== prevOut && !busy) {
    setGen(out)
    setOut('')
    setPrevOut(out)
  }

  function reset() { setGen(''); setAns(''); setStep('config'); setOut(''); setErr(''); setPrevOut('') }

  function genTxt() {
    var w = cur.v === 'LVA' ? '220-250' : '175-210'
    var dir = cur.d === 'theme' ? 'en français' : 'en espagnol'
    setStep('tx'); setGen(''); setOut(''); setErr('')
    run(SYS_BASE, 'Génère un texte ' + dir + ', type article de presse ' + conc + ', ' + w + ' mots, niveau ' + cur.v + ', sur : "' + sujet + '". Date 2024-2026. UNIQUEMENT le texte.')
  }

  function correct() {
    if (!ans.trim()) return
    var dir = cur.d === 'theme' ? 'THÈME FR→ES' : 'VERSION ES→FR'
    run(SYS_BASE, 'Correction ' + dir + ' ' + cur.v + ' — ' + conc + ':\nTEXTE SOURCE : "' + gen + '"\nTRADUCTION : "' + ans + '"\n1. TRADUCTION DE RÉFÉRENCE\n2. ERREURS : [dit] → [correct] → [règle]\n3. POINTS FORTS valorisés\n4. GRAMMAIRE CLÉS (3-4 points)\n5. VOCABULAIRE À RETENIR')
    setStep('done')
  }

  function genSerie() {
    var lb = ''
    for (var i = 0; i < GRAM.length; i++) { if (GRAM[i].id === pt) { lb = GRAM[i].label; break } }
    run(SYS_BASE, 'Série thème grammatical CPGE "' + lb + '" — 5 phrases françaises liées à l\'actualité hispanique → corrigé détaillé + règle synthétique')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', borderRadius: 12, overflow: 'hidden', border: '1.5px solid ' + MIST, marginBottom: 2 }}>
        {TTABS.map(function(t) {
          var isA = tab === t.id
          return (
            <button key={t.id} onClick={function() { setTab(t.id); reset() }} style={{ flex: 1, padding: '8px 4px', border: 'none', borderRight: '1px solid ' + MIST, background: isA ? INK : CREAM, color: isA ? WHITE : SMOKE, fontFamily: "'DM Sans',sans-serif", fontWeight: isA ? 600 : 400, fontSize: '.67rem', cursor: 'pointer', lineHeight: 1.3, textAlign: 'center' }}>{t.l}</button>
          )
        })}
      </div>
      {!isGram && step === 'config' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Label label="Aire thématique"><AireSelect aire={aire} setAire={setAire} color={color} /></Label>
          {aire === 'amerique' ? (
            <Label label="Pays"><SelectField value={pays} onChange={setPays}>{PAYS_AM.map(function(p) { return <option key={p.pays}>{p.pays}</option> })}</SelectField></Label>
          ) : (
            <Label label="Thème"><SelectField value={theme} onChange={setTheme}>{list.map(function(t2) { return <option key={t2}>{t2}</option> })}</SelectField></Label>
          )}
          <Label label="Concours"><ChipGroup vals={['ELVI/BCE', 'Ecricome']} active={conc} set={setConc} color={color} /></Label>
          <GoButton onClick={genTxt} busy={busy} color={color}>✨ Générer le texte</GoButton>
        </div>
      )}
      {!isGram && step === 'tx' && !busy && gen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: MIST, borderRadius: 12, padding: 13, borderLeft: '3px solid ' + color }}>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.68rem', fontWeight: 700, color: color, margin: '0 0 6px', textTransform: 'uppercase', letterSpacing: '1px' }}>{cur.d === 'theme' ? '🇫🇷 À traduire en espagnol' : '🇪🇸 A traducir al francés'}</p>
            <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.86rem', lineHeight: 1.8, color: INK, whiteSpace: 'pre-wrap', margin: 0 }}>{gen}</p>
          </div>
          <Label label={cur.d === 'theme' ? 'Ta traduction en espagnol' : 'Ta traduction en français'}>
            <textarea value={ans} onChange={function(e) { setAns(e.target.value) }} rows={7} style={{ width: '100%', background: CREAM, border: '1.5px solid ' + MIST, borderRadius: 9, padding: '9px 12px', fontFamily: "'DM Sans',sans-serif", fontSize: '.86rem', color: INK, outline: 'none', resize: 'vertical', lineHeight: 1.75 }} placeholder={cur.d === 'theme' ? 'Escribe tu traducción aquí…' : 'Écris ta traduction ici…'} />
          </Label>
          <div style={{ display: 'flex', gap: 8 }}>
            <GoButton onClick={correct} busy={busy} disabled={!ans.trim()} color={color} flex={true}>✅ Corriger</GoButton>
            <button className="btn" onClick={reset} style={{ padding: '11px 16px', background: MIST, borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: '.82rem', color: SMOKE, cursor: 'pointer' }}>↺</button>
          </div>
        </div>
      )}
      {!isGram && step === 'done' && !busy && (
        <button className="btn" onClick={reset} style={{ width: '100%', padding: '12px', background: MIST, borderRadius: 12, fontFamily: "'DM Sans',sans-serif", fontSize: '.88rem', color: SMOKE, cursor: 'pointer', fontWeight: 600 }}>↺ Nouvel exercice</button>
      )}
      {isGram && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Label label="Point grammatical">
            <SelectField value={pt} onChange={setPt}>{GRAM.map(function(g) { return <option key={g.id} value={g.id}>{g.label}</option> })}</SelectField>
          </Label>
          <GoButton onClick={genSerie} busy={busy} color={color}>✏️ Générer la série</GoButton>
        </div>
      )}
      {err && <div style={{ background: '#FFF3F3', border: '1.5px solid #C8102E40', borderRadius: 10, padding: '10px 14px', fontFamily: "'DM Sans',sans-serif", color: RED, fontSize: '.84rem' }}>⚠️ {err}</div>}
    </div>
  )
}

// ── Module 3 — Grammaire ──────────────────────────────────────────
function GramForm(props) {
  var run = props.run
  var busy = props.busy
  var lv = props.lv
  var color = props.color
  var [pt, setPt] = useState(GRAM[0].id)
  var lb = ''
  for (var i = 0; i < GRAM.length; i++) { if (GRAM[i].id === pt) { lb = GRAM[i].label; break } }

  function go() {
    var prompt = 'Cours de grammaire espagnole EN FRANÇAIS sur : "' + lb + '" — Niveau ' + lv + ' CPGE.\n'
    prompt += '## FORMATION ET EMPLOIS [règle complète + tableau si pertinent]\n'
    prompt += '## EMPLOIS PRINCIPAUX [règle + exemple hispanique + traduction pour chaque]\n'
    prompt += '## PIÈGES ET ERREURS FRÉQUENTES [❌ [faux] → ✅ [correct] + règle, 3-4 erreurs]\n'
    prompt += '## EXEMPLES EN CONTEXTE HISPANIQUE [5-6 phrases avec traduction]\n'
    prompt += '## EXERCICE D\'APPLICATION [5 phrases françaises → corrigé détaillé]'
    run(SYS_BASE, prompt)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <InfoBadge color={color}>📖 Cours en français · Exemples hispaniques · Exercice intégré · Niveau {lv}</InfoBadge>
      <Label label="Point grammatical">
        <SelectField value={pt} onChange={setPt}>{GRAM.map(function(g) { return <option key={g.id} value={g.id}>{g.label}</option> })}</SelectField>
      </Label>
      <GoButton onClick={go} busy={busy} color={color}>📖 Générer le cours</GoButton>
    </div>
  )
}

// ── Module 4 — Fiches ─────────────────────────────────────────────
function FicheForm(props) {
  var run = props.run
  var busy = props.busy
  var color = props.color
  var [aire, setAire] = useState('espagne')
  var [theme, setTheme] = useState(THEMES_ES[0])
  var [pays, setPays] = useState(PAYS_AM[0].pays)
  var [custom, setCustom] = useState('')
  var list = getThemeList(aire)
  var paysData = PAYS_AM.find(function(p) { return p.pays === pays })
  var sujet = aire === 'espagne' ? theme : aire === 'amerique' ? pays + ' — ' + (paysData ? paysData.th.split(',')[0] : '') : theme

  function go() {
    var s = custom.trim() || sujet
    var prompt = 'Fiche de civilisation CPGE : "' + s + '"\n'
    prompt += '## CONTEXTE HISTORIQUE ET ENJEUX [4-5 §, faits datés]\n'
    prompt += '## SITUATION ACTUELLE 2023-2025 [2-3 §, données chiffrées]\n'
    prompt += '## VOCABULAIRE THÉMATIQUE [25 mots EN ESPAÑOL avec traduction + exemple]\n'
    prompt += '## EXPRESIONES IDIOMÁTICAS Y CITAS [8 expressions/citations hispaniques]\n'
    prompt += '## RÉFÉRENCES CULTURELLES INCONTOURNABLES [6-8 œuvres/figures commentées]\n'
    prompt += '## AXE COMPARATISTE [liens monde hispanique / Europe / monde]\n'
    prompt += '## PROBLÉMATIQUES ELVI [4 problématiques en español ¿En qué medida…?]'
    run(SYS_BASE, prompt)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <Label label="Aire thématique"><AireSelect aire={aire} setAire={setAire} color={color} /></Label>
      {aire === 'amerique' ? (
        <Label label="Pays"><SelectField value={pays} onChange={setPays}>{PAYS_AM.map(function(p) { return <option key={p.pays}>{p.pays}</option> })}</SelectField></Label>
      ) : (
        <Label label="Thème"><SelectField value={theme} onChange={setTheme}>{list.map(function(t) { return <option key={t}>{t}</option> })}</SelectField></Label>
      )}
      <Label label="Ou sujet libre"><InputField value={custom} onChange={setCustom} placeholder="Ex : Pedro Almodóvar, lithium en Bolivie…" /></Label>
      <GoButton onClick={go} busy={busy} color={color}>📚 Générer la fiche</GoButton>
    </div>
  )
}

// ── Module 5 — Oral ───────────────────────────────────────────────
function OralModule(props) {
  var lv = props.lv
  var conc = props.conc
  var setConc = props.setConc
  var color = GREEN

  var [aire, setAire] = useState('espagne')
  var [theme, setTheme] = useState(THEMES_ES[0])
  var [pays, setPays] = useState(PAYS_AM[0].pays)
  var [step, setStep] = useState('config')
  var [art, setArt] = useState(null)
  var [msgs, setMsgs] = useState([])
  var [fb, setFb] = useState('')
  var [turn, setTurn] = useState(0)
  var [phase, setPhase] = useState('idle')
  var [lastTr, setLastTr] = useState('')
  var [err, setErr] = useState('')
  var [isPro, setIsPro] = useState(false)
  var [ldArt, setLdArt] = useState(false)
  var [ldFb, setLdFb] = useState(false)
  var [voices, setVoices] = useState([])
  var [isSpeaking, setIsSpeaking] = useState(false)
  var [isRec, setIsRec] = useState(false)
  var [audioLvl, setAudioLvl] = useState(0)
  var [wsTr, setWsTr] = useState('')
  var [hasWS, setHasWS] = useState(false)

  var mrRef = useRef(null)
  var chRef = useRef([])
  var stRef = useRef(null)
  var afRef = useRef(null)
  var wsRef = useRef(null)
  var chatRef = useRef(null)

  var list = getThemeList(aire)
  var paysData = PAYS_AM.find(function(p) { return p.pays === pays })
  var sujet = aire === 'espagne' ? theme : aire === 'amerique' ? pays + ' — ' + (paysData ? paysData.th.split(',')[0] : '') : theme
  var c = getElvi(lv)

  useEffect(function() {
    if (typeof window === 'undefined') return
    setHasWS('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    var l = function() { setVoices(window.speechSynthesis ? window.speechSynthesis.getVoices() : []) }
    l()
    if (window.speechSynthesis) window.speechSynthesis.addEventListener('voiceschanged', l)
    return function() { if (window.speechSynthesis) window.speechSynthesis.removeEventListener('voiceschanged', l) }
  }, [])

  useEffect(function() {
    if (chatRef.current) chatRef.current.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' })
  }, [msgs, phase])

  useEffect(function() { if (wsTr) setLastTr(wsTr) }, [wsTr])

  function getBestVoice() {
    var tests = [
      function(v) { return v.name.includes('Monica') },
      function(v) { return v.name.includes('Paulina') },
      function(v) { return v.name.includes('Jorge') },
      function(v) { return v.lang === 'es-ES' },
      function(v) { return v.lang.startsWith('es') },
    ]
    for (var i = 0; i < tests.length; i++) {
      var v = voices.find(tests[i])
      if (v) return v
    }
    return null
  }

  function speakText(text, onEnd) {
    if (typeof window === 'undefined' || !window.speechSynthesis) { if (onEnd) onEnd(); return }
    window.speechSynthesis.cancel()
    setTimeout(function() {
      var u = new SpeechSynthesisUtterance(text)
      u.lang = 'es-ES'; u.rate = 0.88
      var v = getBestVoice(); if (v) u.voice = v
      u.onstart = function() { setIsSpeaking(true) }
      u.onend = function() { setIsSpeaking(false); if (onEnd) onEnd() }
      u.onerror = function() { setIsSpeaking(false); if (onEnd) onEnd() }
      window.speechSynthesis.speak(u)
    }, 120)
  }

  function stopSpeaking() {
    if (window.speechSynthesis) window.speechSynthesis.cancel()
    setIsSpeaking(false)
  }

  function getMime() {
    var types = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg']
    for (var i = 0; i < types.length; i++) { if (MediaRecorder.isTypeSupported(types[i])) return types[i] }
    return ''
  }

  async function startRec() {
    var s = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
    stRef.current = s
    try {
      var ctx = new (window.AudioContext || window.webkitAudioContext)()
      var src = ctx.createMediaStreamSource(s)
      var an = ctx.createAnalyser(); an.fftSize = 256; src.connect(an)
      var tick = function() {
        var d = new Uint8Array(an.frequencyBinCount); an.getByteFrequencyData(d)
        setAudioLvl(Math.min(100, d.reduce(function(a, b) { return a + b }, 0) / d.length * 2))
        afRef.current = requestAnimationFrame(tick)
      }
      tick()
    } catch (e) {}
    var m = getMime()
    var mr = new MediaRecorder(s, m ? { mimeType: m } : {})
    chRef.current = []
    mr.ondataavailable = function(e) { if (e.data.size > 0) chRef.current.push(e.data) }
    mrRef.current = mr; mr.start(100); setIsRec(true)
  }

  function stopRec() {
    return new Promise(function(resolve) {
      cancelAnimationFrame(afRef.current); setAudioLvl(0)
      var mr = mrRef.current
      if (!mr || mr.state === 'inactive') { resolve(null); return }
      mr.onstop = function() { resolve(new Blob(chRef.current, { type: mr.mimeType || 'audio/webm' })) }
      mr.stop()
      if (stRef.current) stRef.current.getTracks().forEach(function(t) { t.stop() })
      setIsRec(false)
    })
  }

  function startWS() {
    if (!hasWS) return
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition
    var x = new SR(); x.lang = 'es-ES'; x.continuous = false; x.interimResults = true
    x.onstart = function() { setWsTr('') }
    x.onerror = function() {}
    x.onresult = function(e) { setWsTr(Array.from(e.results).map(function(r) { return r[0].transcript }).join('')) }
    wsRef.current = x; x.start()
  }

  function stopWS() { if (wsRef.current) wsRef.current.stop() }

  var SYS_ART = 'Tu es professeur d\'espagnol CPGE. Génère un article EN ESPAGNOL pour khôlle ' + conc + ' ' + lv + '. Longueur exacte : ' + c.oral + ' mots. Style journalistique soutenu, actualité hispanique 2024-2026. Source gratuite. Réponds UNIQUEMENT en JSON sans markdown : {"titre":"...","source":"...","date":"...","texte":"...","problemat":"...","mots":0}'
  var SYS_EX = 'Tu es examinateur de khôlle ' + conc + ' ' + lv + ' espagnol CPGE. Parle UNIQUEMENT en espagnol. Réponses COURTES : 2-4 phrases max. Ne corrige PAS pendant l\'oral. Format : résumé (2-3 min) → commentaire (7-8 min) → questions (~5 min). Après 8-10 échanges, conclus. Article : "' + (art ? art.titre : '') + '". Problématique : ' + (art ? art.problemat : '')

  async function fetchArt() {
    setLdArt(true); setErr('')
    try {
      var raw = await callClaude(SYS_ART, [{ role: 'user', content: 'Article sur : "' + sujet + '". Avril 2026.' }])
      var parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
      setArt(parsed); setStep('prep')
    } catch (e) { setErr('Erreur article : ' + e.message) }
    setLdArt(false)
  }

  async function startOral() {
    setStep('oral'); setMsgs([]); setTurn(0); setPhase('processing'); setErr('')
    try {
      var t = await callClaude(SYS_EX, [{ role: 'user', content: 'Lance la khôlle. 2-3 phrases max.' }])
      setMsgs([{ role: 'examiner', text: t }])
      setPhase('speaking')
      speakText(t, function() { setPhase('idle') })
    } catch (e) {
      setMsgs([{ role: 'examiner', text: 'Buenos días. Por favor, empiece con el resumen del artículo.' }])
      setPhase('idle')
    }
  }

  async function pressMic() {
    setErr('')
    if (phase === 'speaking') { stopSpeaking(); setPhase('idle'); return }
    if (phase !== 'idle') return
    if (hasWS) { startWS(); setPhase('recording'); return }
    try { await startRec(); setPhase('recording') } catch (e) { setErr('Micro : ' + e.message) }
  }

  async function releaseMic() {
    if (phase !== 'recording') return
    var tr = ''
    if (hasWS) {
      stopWS(); tr = lastTr || wsTr
    } else {
      setPhase('transcribing')
      var b = await stopRec()
      if (!b || b.size < 800) { setPhase('idle'); setErr('Enregistrement trop court.'); return }
      try { tr = await transcribeBackend(b) } catch (e) { setErr('Transcription : ' + e.message); setPhase('idle'); return }
    }
    if (!tr || !tr.trim()) { setPhase('idle'); setErr('Rien entendu. Réessaie.'); return }
    setLastTr(tr.trim())
    await sendMsg(tr.trim())
  }

  async function sendMsg(text) {
    var um = { role: 'user', text: text }
    var upd = msgs.concat([um])
    setMsgs(upd); setTurn(function(t) { return t + 1 }); setPhase('processing')
    try {
      var history = upd.map(function(m) { return { role: m.role === 'user' ? 'user' : 'assistant', content: m.text } })
      var r = await callClaude(SYS_EX, history)
      setMsgs(upd.concat([{ role: 'examiner', text: r }]))
      setPhase('speaking')
      speakText(r, function() { setPhase('idle') })
    } catch (e) { setErr('Erreur : ' + e.message); setPhase('idle') }
  }

  async function endKholle() {
    stopSpeaking()
    if (isRec) await stopRec()
    stopWS()
    setStep('feedback'); setLdFb(true); setErr('')
    var tr = msgs.map(function(m) { return '[' + (m.role === 'user' ? 'ÉTUDIANT' : 'EXAMINATEUR') + ']\n' + m.text }).join('\n\n')
    try {
      var prompt = 'Article : "' + (art ? art.titre : '') + '" (' + (art ? art.source : '') + ')\n'
      prompt += 'Problématique : ' + (art ? art.problemat : '') + '\n\nTRANSCRIPTION :\n' + tr + '\n\n'
      prompt += 'CORRECTION PÉDAGOGIQUE COMPLÈTE en français :\n'
      prompt += '## 🎯 NOTE /20 ET APPRÉCIATION\n'
      prompt += '## ✅ POINTS FORTS (3-5, avec citations)\n'
      prompt += '## ❌ ERREURS GRAMMATICALES [dit] → [correct] → [règle]\n'
      prompt += '## 📊 ANALYSE DU CONTENU\n'
      prompt += '## 🎯 CONSEILS PERSONNALISÉS (3-5)\n'
      prompt += '## 📚 VOCABULAIRE À RETENIR (10 mots)\n'
      prompt += '## 🔄 REFORMULATIONS SUGGÉRÉES (3 phrases)'
      var f = await callClaude('Tu es professeur agrégé d\'espagnol CPGE. Tu analyses une khôlle ' + conc + ' ' + lv + '.', [{ role: 'user', content: prompt }])
      setFb(f)
    } catch (e) { setFb('Erreur : ' + e.message) }
    setLdFb(false)
  }

  function downloadFb() {
    var lines = ['CORRECTION KHÔLLE ' + conc + ' ' + lv, '='.repeat(50)]
    if (art) { lines.push('Article : ' + art.titre); lines.push('Source : ' + art.source); lines.push('Problématique : ' + art.problemat) }
    lines.push('', '='.repeat(50), '', fb, '', '='.repeat(50), 'TRANSCRIPTION', '='.repeat(50), '')
    lines = lines.concat(msgs.map(function(m) { return '[' + (m.role === 'user' ? 'ÉTUDIANT' : 'EXAMINATEUR') + ']\n' + m.text }))
    var a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }))
    a.download = 'kholle_' + lv + '_' + Date.now() + '.txt'
    a.click()
  }

  function resetOral() {
    setStep('config'); setArt(null); setMsgs([]); setFb('')
    setTurn(0); setPhase('idle'); setLastTr(''); setErr('')
  }

  var micBg = phase === 'recording' ? 'linear-gradient(135deg,#C8102E,#9A0C22)' : phase === 'speaking' ? 'linear-gradient(135deg,#2D6A4F,#1A4A34)' : phase === 'transcribing' || phase === 'processing' ? 'linear-gradient(135deg,#E8A020,#B87A10)' : 'linear-gradient(135deg,#1A3A5C,#2A5A8C)'
  var micIcon = phase === 'recording' ? '⏹' : phase === 'speaking' ? '🔇' : '🎤'

  return (
    <div>
      {/* Header oral */}
      <div style={{ background: color, borderRadius: 14, padding: '14px 20px', marginBottom: 18, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
        <div>
          <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 900, color: WHITE, margin: 0, fontSize: '1rem' }}>🎤 Simulateur de khôlle oral</p>
          <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.72rem', color: 'rgba(255,255,255,.7)', margin: '3px 0 0' }}>{hasWS ? '✅ Chrome — micro natif gratuit' : '🌐 Groq Whisper via backend'}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 10, padding: '8px 14px', fontSize: '.75rem', fontFamily: "'DM Sans',sans-serif", color: WHITE, lineHeight: 1.7 }}>
          <strong>{lv} — {conc}</strong><br />Article {c.oral} mots · 20 min prépa · 15 min oral
        </div>
      </div>

      {err && (
        <div style={{ background: '#FFF0EE', border: '1.5px solid #C8102E40', borderRadius: 12, padding: '11px 15px', marginBottom: 14, fontFamily: "'DM Sans',sans-serif", fontSize: '.84rem', color: RED, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>⚠️ {err}</span>
          <button className="btn" onClick={function() { setErr('') }} style={{ background: 'none', color: RED, cursor: 'pointer', fontSize: '1rem' }}>✕</button>
        </div>
      )}

      {/* CONFIG */}
      {step === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
          <div className="card" style={{ background: WHITE, borderRadius: 18, border: '1.5px solid ' + MIST, overflow: 'hidden', boxShadow: '0 4px 18px rgba(18,32,46,.07)' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg,' + color + ',' + color + '60)' }} />
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Label label="Concours"><ChipGroup vals={['ELVI/BCE', 'Ecricome', 'Khôlle libre']} active={conc} set={setConc} color={color} /></Label>
              <Label label="Aire thématique"><AireSelect aire={aire} setAire={setAire} color={color} /></Label>
              {aire === 'amerique' ? (
                <Label label="Pays"><SelectField value={pays} onChange={setPays}>{PAYS_AM.map(function(p) { return <option key={p.pays}>{p.pays}</option> })}</SelectField></Label>
              ) : (
                <Label label="Thème"><SelectField value={theme} onChange={setTheme}>{list.map(function(t) { return <option key={t}>{t}</option> })}</SelectField></Label>
              )}
              <GoButton onClick={fetchArt} busy={ldArt} color={color}>🔍 Trouver un article & commencer</GoButton>
            </div>
          </div>
          <div className="card" style={{ background: WHITE, borderRadius: 18, border: '1.5px solid ' + MIST, overflow: 'hidden', boxShadow: '0 4px 18px rgba(18,32,46,.07)' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg,' + color + '60,' + color + '10)' }} />
            <div style={{ padding: 18 }}>
              <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: '.95rem', color: color, margin: '0 0 12px' }}>Format {conc} · {lv}</p>
              {[['📄 Article', c.oral + ' mots en espagnol'], ['⏱ Préparation', '20 min — notes sur papier'], ['🗣 Résumé', '2-3 min — reformulation'], ['💬 Commentaire', '7-8 min — problématique + culture'], ['❓ Questions', '~5 min — examinateur IA']].map(function(item) {
                return (
                  <div key={item[0]} style={{ display: 'flex', gap: 12, padding: '9px 0', borderBottom: '1px solid ' + MIST }}>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '.8rem', color: color, minWidth: 120 }}>{item[0]}</span>
                    <span style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.8rem', color: SMOKE }}>{item[1]}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* PRÉPARATION */}
      {step === 'prep' && art && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 18 }}>
          <div className="card" style={{ background: WHITE, borderRadius: 18, border: '1.5px solid ' + MIST, overflow: 'hidden', boxShadow: '0 4px 18px rgba(18,32,46,.07)' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg,' + color + ',' + color + '60)' }} />
            <div style={{ padding: 18 }}>
              <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: '.95rem', color: INK, margin: '0 0 3px' }}>{art.titre}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.72rem', color: SMOKE, margin: '0 0 12px' }}>{art.source} · {art.date}</p>
              <div style={{ background: CREAM, borderRadius: 12, padding: 13, maxHeight: 380, overflowY: 'auto', border: '1px solid ' + MIST }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.85rem', lineHeight: 1.9, color: INK, whiteSpace: 'pre-wrap', margin: 0 }}>{art.texte}</p>
              </div>
              {art.problemat && <InfoBadge color={color} style={{ marginTop: 10 }}>💡 Piste : {art.problemat}</InfoBadge>}
            </div>
          </div>
          <div className="card" style={{ background: WHITE, borderRadius: 18, border: '1.5px solid ' + MIST, overflow: 'hidden', boxShadow: '0 4px 18px rgba(18,32,46,.07)' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg,' + color + '60,' + color + '10)' }} />
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: '.95rem', color: color, margin: 0 }}>⏱ Prépare-toi — 20 min</p>
              {[['Problématique', '¿En qué medida…?'], ['Résumé 2-3 min', 'Reformule, ne paraphrase pas'], ['Commentaire 7-8 min', 'Plan + culture hispanique'], ['Questions ~5 min', 'Défends tes arguments']].map(function(item) {
                return (
                  <div key={item[0]} style={{ padding: '9px 0', borderBottom: '1px solid ' + MIST }}>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 700, fontSize: '.8rem', color: color, margin: '0 0 2px' }}>{item[0]}</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.78rem', color: SMOKE, margin: 0 }}>{item[1]}</p>
                  </div>
                )
              })}
              <GoButton onClick={startOral} color={color} style={{ marginTop: 8 }}>🎤 Commencer l'oral</GoButton>
              <button className="btn" onClick={function() { setStep('config'); setArt(null) }} style={{ padding: '10px', background: MIST, borderRadius: 10, fontFamily: "'DM Sans',sans-serif", fontSize: '.82rem', color: SMOKE, cursor: 'pointer' }}>↺ Autre article</button>
            </div>
          </div>
        </div>
      )}

      {/* ORAL */}
      {step === 'oral' && (
        <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 18 }}>
          {/* Article sidebar */}
          <div className="card" style={{ background: WHITE, borderRadius: 18, border: '1.5px solid ' + MIST, overflow: 'hidden', boxShadow: '0 4px 18px rgba(18,32,46,.07)' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg,' + color + ',' + color + '60)' }} />
            <div style={{ padding: 14 }}>
              <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: '.85rem', color: INK, margin: '0 0 3px' }}>{art ? art.titre : ''}</p>
              <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.7rem', color: SMOKE, margin: '0 0 9px' }}>{art ? art.source : ''}</p>
              <div style={{ maxHeight: 480, overflowY: 'auto', background: CREAM, borderRadius: 10, padding: 11, border: '1px solid ' + MIST }}>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.77rem', lineHeight: 1.85, color: INK, whiteSpace: 'pre-wrap', margin: 0 }}>{art ? art.texte : ''}</p>
              </div>
            </div>
          </div>

          {/* Zone orale */}
          <div className="card" style={{ background: WHITE, borderRadius: 18, border: '1.5px solid ' + MIST, overflow: 'hidden', boxShadow: '0 4px 18px rgba(18,32,46,.07)' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg,' + color + ',' + color + '60)' }} />
            <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '9px 13px', background: CREAM, borderRadius: 11, border: '1px solid ' + MIST }}>
                <div style={{ width: 9, height: 9, borderRadius: '50%', background: phase === 'recording' ? RED : phase === 'speaking' ? color : phase === 'processing' || phase === 'transcribing' ? GOLD : FOG, transition: 'all .3s' }} />
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: '.78rem', color: SMOKE, margin: 0, flex: 1 }}>
                  {phase === 'idle' && 'En attente — appuie sur le micro'}
                  {phase === 'recording' && '🔴 Écoute… Relâche pour envoyer'}
                  {phase === 'transcribing' && '⏳ Transcription…'}
                  {phase === 'processing' && "⏳ L'examinateur réfléchit…"}
                  {phase === 'speaking' && "🔊 L'examinateur parle — appuie pour interrompre"}
                </p>
                <span style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.7rem', color: FOG }}>Tour {turn}</span>
              </div>

              {/* Chat */}
              <div ref={chatRef} style={{ flex: 1, minHeight: 250, maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {msgs.length === 0 && <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.82rem', color: FOG, textAlign: 'center', margin: 'auto' }}>L'examinateur va prendre la parole…</p>}
                {msgs.map(function(m, i) {
                  var isUser = m.role === 'user'
                  return (
                    <div key={i} className="msg" style={{ display: 'flex', flexDirection: 'column', alignItems: isUser ? 'flex-end' : 'flex-start' }}>
                      <div style={{ maxWidth: '85%', background: isUser ? INK : CREAM, color: isUser ? WHITE : INK, border: isUser ? 'none' : '1px solid ' + MIST, borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px', padding: '10px 14px', fontFamily: "'DM Sans',sans-serif", fontSize: '.85rem', lineHeight: 1.7 }}>
                        {m.text}
                      </div>
                      <span style={{ fontSize: '.66rem', color: FOG, margin: '3px 6px', fontFamily: "'DM Sans',sans-serif" }}>{isUser ? 'Tú' : 'Examinador IA'}</span>
                    </div>
                  )
                })}
                {(phase === 'processing' || phase === 'transcribing') && (
                  <div style={{ alignSelf: 'flex-start', background: CREAM, border: '1px solid ' + MIST, borderRadius: '16px 16px 16px 4px', padding: '10px 15px', display: 'flex', gap: 5 }}>
                    {[0, 1, 2].map(function(i) { return <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: FOG, animation: 'bar .9s ' + (i * 0.18) + 's infinite' }} /> })}
                  </div>
                )}
              </div>

              {/* Visualiseur */}
              {phase === 'recording' && !hasWS && (
                <div style={{ display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center', height: 24 }}>
                  {[0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(function(i) {
                    return <div key={i} style={{ width: 4, borderRadius: 3, background: RED, height: (10 + audioLvl * 0.1 * Math.sin(i * 0.7 + 1) * 6) + 'px', animation: 'bar ' + (.35 + i * .05) + 's infinite', opacity: 0.55 + i * 0.03 }} />
                  })}
                </div>
              )}

              {/* Bouton micro */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                <div style={{ position: 'relative' }}>
                  {phase === 'recording' && <div style={{ position: 'absolute', inset: -8, borderRadius: '50%', background: RED + '18', animation: 'ripple 1.2s infinite', pointerEvents: 'none' }} />}
                  <button className="btn" onPointerDown={pressMic} onPointerUp={releaseMic} onPointerLeave={phase === 'recording' ? releaseMic : undefined} disabled={phase === 'transcribing' || phase === 'processing'} style={{ width: 80, height: 80, borderRadius: '50%', fontSize: '1.8rem', background: micBg, border: 'none', cursor: (phase === 'transcribing' || phase === 'processing') ? 'not-allowed' : 'pointer', boxShadow: phase === 'recording' ? '0 6px 24px rgba(200,16,46,.45)' : '0 4px 18px rgba(0,0,0,.15)', animation: phase === 'recording' ? 'glow 1.2s infinite' : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all .2s' }}>
                    {(phase === 'transcribing' || phase === 'processing') ? <div style={{ width: 24, height: 24, border: '3px solid rgba(255,255,255,.25)', borderTop: '3px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> : micIcon}
                  </button>
                </div>
                <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.76rem', color: SMOKE, textAlign: 'center', margin: 0, maxWidth: 220 }}>
                  {phase === 'idle' ? (hasWS ? 'Appuie pour parler (Chrome gratuit)' : 'Appuie pour parler (Groq backend)') : phase === 'recording' ? 'Parle… Relâche pour envoyer' : phase === 'transcribing' ? 'Transcription…' : phase === 'processing' ? "L'examinateur réfléchit…" : "L'examinateur parle — appuie pour interrompre"}
                </p>
              </div>

              <button className="btn" onClick={endKholle} style={{ width: '100%', padding: '12px', background: GOLD_LIGHT, border: '1.5px solid ' + GOLD, borderRadius: 12, fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: '.9rem', color: '#8A6010', cursor: 'pointer' }}>
                ✅ Terminer et obtenir la correction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK */}
      {step === 'feedback' && (
        <div>
          <div className="card" style={{ background: WHITE, borderRadius: 18, border: '1.5px solid ' + MIST, overflow: 'hidden', marginBottom: 16, boxShadow: '0 4px 18px rgba(18,32,46,.07)' }}>
            <div style={{ height: 4, background: 'linear-gradient(90deg,' + color + ',' + color + '60)' }} />
            <div style={{ padding: '13px 18px', borderBottom: '1px solid ' + MIST }}>
              <span style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: '.95rem', color: color }}>📋 Correction pédagogique personnalisée</span>
            </div>
            <div style={{ padding: 18, minHeight: 280 }}>
              {ldFb ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 260, gap: 14 }}>
                  <div style={{ width: 36, height: 36, border: '3px solid ' + color + '20', borderTop: '3px solid ' + color, borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', color: SMOKE, fontSize: '.86rem', animation: 'pulse 1.5s infinite', margin: 0 }}>Analyse en cours…</p>
                </div>
              ) : (
                <div className="out" style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.88rem', lineHeight: 1.85, color: INK, whiteSpace: 'pre-wrap' }}>{fb}</div>
              )}
            </div>
          </div>
          {!ldFb && fb && (
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: 260, background: isPro ? GREEN + '08' : WHITE, border: '1.5px solid ' + (isPro ? GREEN : MIST), borderRadius: 16, padding: 16, boxShadow: '0 4px 16px rgba(18,32,46,.06)' }}>
                {isPro ? (
                  <div>
                    <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, color: GREEN, fontSize: '.9rem', margin: '0 0 10px' }}>✅ Premium — Téléchargement disponible</p>
                    <GoButton onClick={downloadFb} color={GREEN}>⬇️ Télécharger correction + transcription (.txt)</GoButton>
                  </div>
                ) : (
                  <div>
                    <p style={{ fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, color: SMOKE, fontSize: '.9rem', margin: '0 0 4px' }}>🔒 Version Premium</p>
                    <p style={{ fontFamily: "'DM Sans',sans-serif", fontStyle: 'italic', fontSize: '.8rem', color: FOG, margin: '0 0 12px' }}>Télécharge la correction + transcription au format .txt</p>
                    <button className="btn" onClick={function() { setIsPro(true) }} style={{ width: '100%', padding: '12px', background: GOLD_LIGHT, border: '1.5px solid ' + GOLD, borderRadius: 12, fontFamily: "'Fraunces',Georgia,serif", fontWeight: 700, fontSize: '.88rem', color: '#8A6010', cursor: 'pointer' }}>🌟 Simuler accès Premium (démo)</button>
                  </div>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9, minWidth: 180 }}>
                <GoButton onClick={resetOral} color={GREEN}>🔄 Nouvelle khôlle</GoButton>
                <button className="btn" onClick={function() { setStep('oral') }} style={{ padding: '11px', background: MIST, borderRadius: 12, fontFamily: "'DM Sans',sans-serif", fontSize: '.85rem', color: SMOKE, cursor: 'pointer' }}>↺ Revoir la transcription</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
