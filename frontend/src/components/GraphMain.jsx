import React from 'react';
import Graph1 from './Graph'
import Graph2 from './Graph2'

export default function Dashboard() {
  return (
    <>
      <div className='flex w-full'>
<div>
    <Graph1></Graph1>
</div>
<div>
    <Graph2></Graph2>
</div>
      </div>
    </>
  );
}
