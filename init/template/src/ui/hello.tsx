import React from "react"

export default function Hello() {
   return (
    <>
      <div className="head">Hello Backbone!</div>
      <div className="sub vertical-space">
        <div className="sub-headline">See the power of self-sovereign dapps</div> 
        <ul className="list">
          <li>
            1. Keep this tab open.
          </li>
          <li>
            2. Terminate the command line instance running this application.
          </li>
          <li>
            3. Open {location.href} on another browser (not a tab).
          </li>
          <li>
            4. The app is now served from your first tab.
          </li>
        </ul>
      </div>
      <div className="sub vertical-space">
        Check out <a href="https://github.com/backbonedao/demos" target="_blank">demo apps</a> for inspiration 
      </div>
    </>
  )
}
