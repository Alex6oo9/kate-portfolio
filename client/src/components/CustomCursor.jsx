import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const cursorRef = useRef(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let mx = 0
    let my = 0
    let raf

    const handleMove = (e) => {
      mx = e.clientX
      my = e.clientY
    }
    document.addEventListener('mousemove', handleMove)

    const tick = () => {
      cursor.style.left = mx + 'px'
      cursor.style.top = my + 'px'
      raf = requestAnimationFrame(tick)
    }
    tick()

    const onEnter = () => {
      cursor.style.width = '34px'
      cursor.style.height = '34px'
      cursor.style.borderColor = 'rgba(212,175,55,0.75)'
      cursor.style.background = 'rgba(212,175,55,0.07)'
    }
    const onLeave = () => {
      cursor.style.width = '14px'
      cursor.style.height = '14px'
      cursor.style.borderColor = 'rgba(212,175,55,0.5)'
      cursor.style.background = 'transparent'
    }

    const handleOver = (e) => {
      if (e.target.closest('a, button')) onEnter()
    }
    const handleOut = (e) => {
      const related = e.relatedTarget
      if (e.target.closest('a, button') && !(related && related.closest('a, button'))) onLeave()
    }
    document.addEventListener('mouseover', handleOver)
    document.addEventListener('mouseout', handleOut)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove', handleMove)
      document.removeEventListener('mouseover', handleOver)
      document.removeEventListener('mouseout', handleOut)
    }
  }, [])

  return (
    <div
      id="custom-cursor"
      ref={cursorRef}
      style={{
        position: 'fixed',
        top: '-30px',
        left: '-30px',
        width: '14px',
        height: '14px',
        borderRadius: '50%',
        border: '1px solid rgba(212,175,55,.5)',
        pointerEvents: 'none',
        zIndex: 9999,
        transform: 'translate(-50%,-50%)',
        transition:
          'width 300ms ease, height 300ms ease, border-color 300ms ease, background 300ms ease',
      }}
    />
  )
}
