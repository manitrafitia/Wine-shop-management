import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepBackward, faStepForward, faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import Logo from '../assets/logo.png';
import { useContext, createContext, useState } from "react"

const SidebarContext = createContext()

export default function Sidebar({ children }) {
  const [expanded, setExpanded] = useState(true)
  
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white shadow-md w-300">
        <div className="p-4 pb-2 flex justify-between items-center">
          <img
             src={Logo} 
            className={`overflow-hidden transition-all ${
              expanded ? "w-40" : "w-0"
            }`}
            alt=""
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg text-slate-600 hover:text-slate-800"
          >
            {expanded ? <FontAwesomeIcon icon={faStepBackward} /> : <FontAwesomeIcon icon={faStepForward} />}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">{children}</ul>
        </SidebarContext.Provider>

        <div className="border-t flex p-3">
          <img
            src=""
            alt=""
            className="w-10 h-10 rounded-md"
          />
          <div
            className={`
              flex justify-between items-center
              overflow-hidden transition-all ${expanded ? "w-52 ml-3" : "w-0"}
          `}
          >
            <div className="leading-4">
              <h4 className="font-semibold">Mariella</h4>
              <span className="text-xs text-slate-600">mariellafitia@gmail.com</span>
            </div>
            <FontAwesomeIcon icon={faEllipsisV} />
          </div>
        </div>
      </nav>
    </aside>
  )
}

export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext)
  
  return (
    <li
      className={`
        relative flex items-center py-3 px-3 my-1
        font-medium rounded-lg cursor-pointer ml-2
        transition-colors group
        ${
          active
            ? "shadow-md bg-pink-700 text-white"
            : "hover:bg-slate-200 text-slate-600"
        }
    `}
    >
      <FontAwesomeIcon icon={icon} />
      <span
        className={`overflow-hidden transition-all text-left ${
          expanded ? "w-40 ml-10" : "w-0"
        }`}
      >
        {text}
        
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-slate-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
          absolute left-full rounded-md px-2 py-1 ml-6
          bg-white text-slate-800 text-sm
          invisible opacity-20 -translate-x-3 transition-all
          group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
      `}
        >
        {text}
        </div>
      )}
    </li>
  )
}
