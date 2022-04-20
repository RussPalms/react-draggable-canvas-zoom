import React, { Component } from 'react';
import { render } from 'react-dom';
import Draggable from 'react-draggable';
import './style.css';
import * as R from 'ramda'
import _ from 'lodash'

const canvasSize = 2000

const createShadow = (size) => `${size}px ${size}px 10px #ccc inset`
const shadowSize = 8

const dragInertia = 20

const zoomBy = 0.1

const App: React.FC = () => {
  const containerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const { innerHeight, innerWidth } = window

    const scrollDown = (canvasSize - innerHeight) / 2
    const scrollLeft = (canvasSize - innerWidth) / 2

    containerRef.current.scroll(scrollLeft, scrollDown)
  }, [])

  const [scale, setScale] = React.useState(1);

  const [{ clientX, clientY }, setClient] = React.useState({ clientX: 0, clientY: 0 });

  const [overflow, setOverflow] = React.useState<string>('scroll');

  const [{ translateX, translateY }, setTranslate] = React.useState({ translateX: 0, translateY: 0 });

  return (
    <div
      ref={containerRef}
      style={{
        width: '100vw',
        height: '100vh',
        overflow,
      }}
    >
      <div
        style={{
          border: '2px solid tomato',
          cursor: 'grab',
          height: canvasSize,
          width: canvasSize,
          boxShadow: `${createShadow(shadowSize)}, ${createShadow(-shadowSize)}`,
          backgroundImage: `
            linear-gradient(45deg, #ccc 25%, transparent 25%),
            linear-gradient(-45deg, #ccc 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, #ccc 75%),
            linear-gradient(-45deg, #eee 75%, #ccc 75%)`,
          backgroundSize: `20px 20px`,
          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px',
          transform: `scale(${scale}, ${scale}) translate(${translateX}px, ${translateY}px)`,
          transformOrigin: '0 0',
        }}

        onDragStart={e => {
          const preview = document.createElement('div')
          preview.style.display = 'none'
          e.dataTransfer.setDragImage(preview, 0, 0);

          setClient({ clientX: e.clientX, clientY: e.clientY })
        }}
        onDrag={e => {
          if (e.clientX && e.clientY) {
            const deltaX = (clientX - e.clientX) / dragInertia
            const deltaY = (clientY - e.clientY) / dragInertia

            containerRef.current.scrollBy(deltaX, deltaY)
          }
        }}
        draggable

        onWheel={e => {
          if (e.deltaY > 0) {
             if (scale === 1) {
              setOverflow('hidden')
            }
            if (scale > 1) {
              setScale(scale - zoomBy)
            }
          } else {
            setScale(scale + zoomBy)
          }
        }}

      />
    </div>
  );
}

render(<App />, document.getElementById('root'));
