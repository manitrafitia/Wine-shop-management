import React from 'react'

export function SidebarItem({ icon, text, active, alert}) {
    return (
        <li className=''>
            {icons}
            <span>{ text }</span>
        </li>
    )
}