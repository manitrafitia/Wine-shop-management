import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStepBackward, faStepForward, faEllipsisV, faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import Logo from '../assets/logo.png';
import { useContext, createContext, useState } from "react";
import Login from './Login';

const SidebarContext = createContext();

export default function Sidebar({ children, onLogout }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen shadow-lg sticky top-0 bg-gray-900 h-full flex flex-col">
      <div className="p-4 h-screen  pb-1 flex justify-between items-center">
        <div className={`flex items-center justify-center pl-4 text-blush-600 text-l ${expanded ? "w-40" : "w-0 collapse"}`}>
          <img src='logo.png' className='w-20 mr-2' alt='Logo' />
          <span>Vinspiration</span>
        </div>
        <button
          onClick={() => setExpanded((curr) => !curr)}
          className="p-1.5 rounded-lg text-charade-600 hover:text-charade-800"
        >
          {expanded ? <FontAwesomeIcon icon={faStepBackward} /> : <FontAwesomeIcon icon={faStepForward} />}
        </button>
      </div>
      <nav className="w-300 pt-7 pb-10">
        <div className=''>
          <SidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 mt-5 text-white px-3">{children}</ul>
          </SidebarContext.Provider>
        </div>
      </nav>
      <div className="flex p-3">
        <div className="leading-4">
          <button
            type="button"
            onClick={onLogout} // Appel de la fonction de déconnexion fournie par le parent
            className={`
              relative flex items-center p-4 my-1
              font-medium rounded-lg cursor-pointer ml-2
              transition-colors group mr-0 text-charade-100
              hover:bg-charade-800
            `}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            <span
              className={`overflow-hidden transition-all text-left ${expanded ? "w-40 ml-10" : "w-0"}`}
            >
              Déconnexion
            </span>
          </button>
        </div>
      </div>
    </aside>
  );
}


export function SidebarItem({ icon, text, active, alert }) {
  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`
        relative flex items-center p-4 my-1 
        font-medium rounded-lg cursor-pointer ml-2
        transition-colors group mr-0 text-charade-100
        ${active ? "shadow-md bg-blush-800 text-white" : "hover:bg-charade-800"}
      `}
    >
      <FontAwesomeIcon icon={icon} />
      <span
        className={`overflow-hidden transition-all text-left ${expanded ? "w-40 ml-10" : "w-0"}`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-charade-400 ${expanded ? "" : "top-2"}`}
        />
      )}
      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-charade-900 text-white text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
          `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
