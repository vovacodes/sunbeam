import React from 'react';
import last from 'lodash.last';
import GridItem from './GridItem';

const NUMBER_OF_ITEMS_IN_THE_ROW = 3;

export default class Grid extends React.Component {
  render() {
    const { gridData, focusedGridItemId } = this.props;
    const gridItems = gridData
        .reduce((table, { text, id }, index) => {
          let rowItems;
          if (index % NUMBER_OF_ITEMS_IN_THE_ROW === 0) {
            // create new row
            rowItems = [ <GridItem isFocused={id === focusedGridItemId} key={id} >{text}</GridItem> ];
            table.push(rowItems);
          } else {
            // add items to the previously created row
            rowItems = last(table);
            rowItems.push(<GridItem isFocused={id === focusedGridItemId} key={id} >{text}</GridItem>);
          }

          return table;
        }, [])
        .map((rowItems, index) => {
          return <tr key={index}>{rowItems}</tr>;
        });

    return (
        <table className="grid">
          <tbody>{gridItems}</tbody>
        </table>
    );
  }
}
