import React from 'react';
import Chart from '../components/Chart';
import Cards from '../components/Cards';
import List from './List';

export default function Dashboard() {
  return (
    <>
      <div>
        <Cards></Cards>
      </div>
      <div className="m-4 mt-4 flex justify-center">
        <div className="w-1/2 mx-2">
          <Chart></Chart>
        </div>
        <div className="w-1/2 mx-2">
          <List></List>
        </div>
      </div>
    </>
  );
}
