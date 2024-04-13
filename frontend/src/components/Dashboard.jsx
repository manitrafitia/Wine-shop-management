import React from 'react';
import Graph from '../components/Graph';
import Cards from '../components/Cards';
import List from './List';
import Catalogue from './Catalogue';
import Chart from '../components/Chart';
import Graph2 from './Graph2'

export default function Dashboard() {
  return (
    <>
      <div>
        <Cards></Cards>
      </div>
      <div className="m-4 mt-2 flex justify-center">
        <div className="w-1/2 mx-2">
          <Graph></Graph>
          <Chart></Chart>
        </div>

        <div className="w-1/2 mx-2">
        <Graph2></Graph2>
          <List></List>
        </div>
      </div>
    </>
  );
}
