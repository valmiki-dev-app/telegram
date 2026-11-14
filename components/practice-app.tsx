'use client'

import { useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Check, ChevronRight, CircleHelp, Clock3, LockKeyhole, MessageCircle, Settings2, X } from 'lucide-react'

type Task = { kind: 'build' | 'choice' | 'text'; prompt: string; answer?: string; tiles?: string[]; options?: string[]; hint: string }

const tasks: Task[] = [
  { kind: 'build', prompt: 'Соберите фразу: «Я дома»', answer: 'I am at home', tiles: ['home', 'I', 'at', 'am'], hint: 'Маленькое слово стоит сразу после «я». Попробуйте ещё раз.' },
  { kind: 'choice', prompt: 'Выберите верный вариант', answer: 'She works in an office.', options: ['She work in an office.', 'She works in an office.', 'She is work in an office.'], hint: 'С he и she к глаголу часто добавляется -s.' },
  { kind: 'text', prompt: 'Напишите по-английски: «Я работаю в офисе»', answer: 'I work in an office', hint: 'Начните с I, затем поставьте действие work.' },
]
const lessons = [
  { n: '01', title: 'Как собрать английскую фразу', progress: 2 },
  { n: '02', title: 'Глагол to be: am, is, are', progress: 0 },
  { n: '03', title: 'Вопросы и «не»', progress: 0 },
  { n: '04', title: 'Can: просьбы и «можно?»', progress: 0 },
  { n: '05', title: 'Три ситуации из жизни', progress: 0 },
]

function Mark({ children }: { children: React.ReactNode }) { return <span className="marker">{children}</span> }

export function PracticeApp() {
  const [screen, setScreen] = useState<'home' | 'lesson' | 'practice' | 'how'>('home')
  const [taskIndex, setTaskIndex] = useState(0)
  const [selected, setSelected] = useState<string[]>([])
  const [typed, setTyped] = useState('')
  const [feedback, setFeedback] = useState<'almost' | 'correct' | null>(null)
  const [attempts, setAttempts] = useState(0)
  const [done, setDone] = useState(false)
  const [lessonSelected, setLessonSelected] = useState(0)
  const currentTask = tasks[taskIndex]
  const isBuild = currentTask?.kind === 'build'
  const answer = isBuild ? selected.join(' ') : currentTask?.kind === 'text' ? typed.trim() : selected[0]
  const usedTiles = useMemo(() => selected.map((word) => currentTask?.tiles?.indexOf(word) ?? -1), [selected, currentTask])
  const checkAnswer = () => {
    if (!currentTask) return
    const correct = answer.toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim() === currentTask.answer?.toLowerCase().replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim()
    if (correct) setFeedback('correct')
    else { setAttempts((n) => n + 1); setFeedback('almost') }
  }
  const nextTask = () => {
    setFeedback(null); setSelected([]); setTyped(''); setAttempts(0)
    if (taskIndex + 1 >= tasks.length) setDone(true)
    else setTaskIndex((n) => n + 1)
  }
  const startPractice = () => { setTaskIndex(0); setDone(false); setFeedback(null); setSelected([]); setScreen('practice') }

  return (
    <main className="app-shell">
      <div className="app-frame">
        <header className="top-brand">
          <div className="brand-mark" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="4.5" y="3.2" width="4.2" height="3.8" rx="1"/><rect x="3" y="7.4" width="18" height="1.8" rx=".9"/><rect x="12.5" y="10" width="5.5" height="3.8" rx="1"/><rect x="3" y="14.2" width="18" height="1.8" rx=".9"/><rect x="7" y="16.8" width="4" height="3.8" rx="1" fillOpacity=".6"/><rect x="3" y="21" width="18" height="1.8" rx=".9"/></svg></div>
          <span className="brand-caption">английский с нуля</span>
          <button className="icon-button" aria-label="Настройки" onClick={() => setScreen('how')}><Settings2 size={19}/></button>
        </header>

        {screen === 'home' && <div className="screen-enter home-screen" key="home">
          <section className="greeting"><p className="hand note">день 3 из 15</p><h1>Привет, Анна!</h1><p className="lead">Слова уже не кучей — раскладываем дальше.</p><div className="journey-track" aria-label="Пройдено 2 дня из 15"><span className="journey-fill"/><i/><i/><i/><i/><i/></div></section>
          <section className="today-card">
            <div className="today-meta"><span>Урок 1 · практика 3 из 3</span><span className="duration"><Clock3 size={15}/> ≈ 6 минут</span></div>
            <h2>he, she и -s</h2><p>8 заданий, мини-диалог и немного практики</p>
            <button className="primary-button" onClick={startPractice}>Начать практику <ArrowRight size={18}/></button>
          </section>
          <section className="shelf-section"><div className="section-heading"><h2>Ваша стенка</h2><span>2 из 15</span></div><div className="shelf-list">{lessons.map((lesson, i) => <button key={lesson.n} className={`shelf-row ${i === 0 ? 'active-shelf' : ''}`} onClick={() => { setLessonSelected(i); setScreen('lesson') }} aria-label={`Урок ${lesson.n}: ${lesson.title}`}><span className="lesson-number">{lesson.n}</span><span className="shelf-main"><span className="shelf-title">{lesson.title}</span><span className="books" aria-label={`${lesson.progress} из 3 практик пройдено`}>{[0,1,2].map((book) => <i key={book} className={book < lesson.progress ? 'book done-book' : `book ${i > 0 ? 'locked-book' : ''}`} />)}</span></span><ChevronRight className="shelf-chevron" size={17}/></button>)}</div></section>
          <div className="streak"><span className="streak-rule"/>2 дня подряд<span className="streak-rule"/></div>
          <nav className="bottom-links"><button onClick={() => setScreen('how')}><CircleHelp size={17}/>Как это работает<ChevronRight size={16}/></button><button onClick={() => setScreen('how')}><MessageCircle size={17}/>Задать вопрос<ChevronRight size={16}/></button></nav>
        </div>}

        {screen === 'lesson' && <section className="subscreen screen-enter" key={`lesson-${lessonSelected}`}><button className="back-link" onClick={() => setScreen('home')}><ArrowLeft size={17}/>На главную</button><div className="lesson-card"><span className="lesson-big-number">{lessons[lessonSelected].n}</span><h1>{lessons[lessonSelected].title}</h1><div className="chip-row"><span>5–8 минут</span><span>3 практики</span><span>урок в канале</span></div><p className="hand rose-note">после урока: собирать фразы увереннее</p></div><h2 className="subheading">Ваши практики</h2><div className="practice-list">{['День 1 · после видеоурока','День 2 · закрепляем','День 3 · собираем сами'].map((label, i) => <div className="practice-row" key={label}><span className={`day-dot ${i < 2 && lessonSelected === 0 ? 'day-done' : ''}`}>{i < 2 && lessonSelected === 0 ? <Check size={15}/> : i + 1}</span><span className="practice-label"><strong>{label}</strong><small>{i < 2 && lessonSelected === 0 ? 'Пройдена' : i === 2 && lessonSelected === 0 ? 'В процессе · задание 3' : 'Откроется по расписанию'}</small></span>{i === 2 && lessonSelected === 0 ? <button className="text-action" onClick={startPractice}>Продолжить</button> : <LockKeyhole size={16} className="muted-icon"/>}</div>)}</div><button className="secondary-button full-button" onClick={() => setScreen('home')}>Смотреть урок в канале ↗</button></section>}

        {screen === 'practice' && <section className="player screen-enter" key="practice"><div className="player-top"><button className="icon-button" aria-label="Закрыть практику" onClick={() => setScreen('home')}><X size={20}/></button><div className="progress-wrap"><div className="progress-track"><span style={{width: done ? '100%' : `${((taskIndex + 1) / tasks.length) * 100}%`}}/></div><span>{done ? 'Готово' : `Задание ${taskIndex + 1} из ${tasks.length}`}</span></div></div>
          {done ? <div className="complete-state"><div className="book-confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--i': i, '--x': `${((i % 9) - 4) * 18}px` } as React.CSSProperties} />)}</div><p className="hand note">готово!</p><h1>Практика <Mark>пройдена</Mark></h1><p className="lead">Три задания — и фразы уже разложены по полочкам.</p><div className="mini-shelf"><span>Урок 1</span><i/><i/><i/></div><button className="primary-button" onClick={() => setScreen('home')}>Готово на сегодня <ArrowRight size={18}/></button></div> : <><div className="task-content task-enter" key={`task-${taskIndex}`}><p className="task-kicker">Практика · урок 1</p><h1 className="task-title">{currentTask.prompt}</h1>{isBuild && <><div className="answer-line" aria-label="Собранный ответ">{selected.length ? selected.map((word, i) => <button className="answer-tile" key={`${word}-${i}`} onClick={() => setSelected((s) => s.filter((_, index) => index !== i))}>{word}</button>) : <span className="empty-hint">нажимайте на слова по порядку</span>}</div><div className="tile-bank">{currentTask.tiles?.map((word, i) => { const isUsed = usedTiles.includes(i); return <button key={`${word}-${i}`} disabled={isUsed} className={`word-tile ${isUsed ? 'tile-used' : ''}`} aria-label={`Слово ${word}, нажмите, чтобы добавить`} onClick={() => setSelected((s) => [...s, word])}>{word}</button> })}</div></>}
            {currentTask.kind === 'choice' && <div className="option-list">{currentTask.options?.map((option) => <button key={option} className={`option-button ${selected[0] === option ? 'option-selected' : ''}`} onClick={() => setSelected([option])}>{option}</button>)}</div>}
            {currentTask.kind === 'text' && <div className="text-field-wrap"><input className="text-answer" value={typed} onChange={(e) => setTyped(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter' && !e.nativeEvent.isComposing && e.keyCode !== 229) checkAnswer() }} placeholder="Ваш ответ на английском" autoCapitalize="sentences" autoCorrect="off" spellCheck={false} aria-label="Введите ответ на английском"/><span>Переключите клавиатуру на английскую</span></div>}
            {feedback && <div className={`feedback-sheet ${feedback === 'correct' ? 'feedback-correct' : ''}`} aria-live="polite"><div className="feedback-title"><span className="hand">{feedback === 'correct' ? 'верно!' : 'почти!'}</span>{feedback === 'correct' && <Check size={18}/>}</div><p>{feedback === 'correct' ? 'Отлично. Именно так эта фраза и складывается.' : currentTask.hint}</p>{feedback === 'almost' && attempts >= 2 && <p className="right-answer">Правильно так: <strong>{currentTask.answer}</strong></p>}<button className="feedback-action" onClick={feedback === 'almost' && attempts < 2 ? () => setFeedback(null) : nextTask}>{feedback === 'almost' && attempts < 2 ? 'Попробовать ещё раз' : 'Дальше'}<ArrowRight size={17}/></button></div>}
          </div><div className="player-footer">{!feedback && <button className="primary-button" disabled={isBuild ? selected.length !== (currentTask.tiles?.length ?? 0) : currentTask.kind === 'text' ? !typed.trim() : !selected.length} onClick={checkAnswer}>Проверить <ArrowRight size={18}/></button>}<p>Ошибаться можно — это часть практики</p></div></>}
        </section>}

        {screen === 'how' && <section className="subscreen screen-enter" key="how"><button className="back-link" onClick={() => setScreen('home')}><ArrowLeft size={17}/>На главную</button><p className="hand note">всё по шагам</p><h1>Как это работает</h1><p className="lead how-lead">Сухая теория сама по себе говорить не учит. Поэтому главное — практика.</p><div className="how-card"><span>01</span><div><strong>Урок в канале</strong><p>Смотрите короткое видео, когда удобно.</p></div></div><div className="how-card"><span>02</span><div><strong>Практика здесь, 5–8 минут</strong><p>Собирайте фразы и пробуйте говорить.</p></div></div><div className="how-card"><span>03</span><div><strong>Ошибаться можно</strong><p>Если что-то не сложилось — будет подсказка.</p></div></div><button className="secondary-button full-button" onClick={() => setScreen('home')}>Понятно</button></section>}
        <footer className="app-footer">Разложи английский по полочкам</footer>
      </div>
    </main>
  )
}
