import React from "react"
import { useState, useEffect } from "react"
import { bb, monitorDatabase } from "./helpers"

export default function Hello() {
  const [msgs, setMsgs] = useState([])
  const [msg, setMsg] = useState("")

  // get messages ONCE when component mounts
  useEffect(() => {
    refreshMsgs()
    monitorDatabase(setMsgs)
  }, [])

  async function refreshMsgs() {
    const msgs = bb() ? await bb().all() : []
    setMsgs(msgs)
  }

  async function addMessage(e?) {
    if (e) e.PreventDefault()
    if (msg) {
      bb() ? await bb().set({ key: new Date().getTime().toString(), value: msg }) : null
      setMsg("")
      await refreshMsgs()
    }
  }

  return (
    <>
      <div className="head">Anonymous chat</div>
      <div className="sub">
        {!location.href.match(/#0x/)
          ? `Open ${location.href}#${window["_dev_address"]} on another browser (not a tab)`
          : ""}{" "}
      </div>
      <div id="messages">
        <table>
          <tbody>
            {msgs.map((v, i) => {
              return (
                <tr key={i}>
                  <td className="pointer">{">"}</td>
                  <td className="message">{v}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <input
            type="text"
            placeholder="what's on your mind?"
            name="msg"
            id="msg"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
          <button type="submit" onClick={() => addMessage()}>
            Post
          </button>
        </form>
      </div>
    </>
  )
}
