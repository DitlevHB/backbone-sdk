/**
 * Add your UI initialization code into this file.
 * i.e. const UI = require("./my-react-app.js")
 */
import React from "react"
import ReactDOM from "react-dom/client"
import Hello from './hello'
import styles from './styles.scss'

// install styles to the document
if(typeof window === 'object') {
  const css = document.createElement('style')
  css.setAttribute('id', 'app-style')
  css.innerHTML = styles
  document.body.appendChild(css)
}

export default async () => {
  /**
   * Backbone Bootloader creates #UI div, so you can do something like
   * ReactDOM.createRoot(document.getElementById('UI')).render(UI)
   *
   * This function will be automatically executed when app is loaded in Bootloader.
   */
  const root = ReactDOM.createRoot(document.getElementById("UI"))
  root.render(<Hello />)
}
