import React from 'react';
import ReactDOM from 'react-dom';
import TabBar from './TabBar';
import Menu from './Menu';
import Grid from './Grid';
import FocusableContainer from '../src/FocusableContainer';
import FocusManager from '../src/FocusManager';
import verticalIndexBasedFocusStrategy from '../src/strategies/verticalIndexBasedFocusStrategy';
import horizontalIndexBasedFocusStrategy from '../src/strategies/horizontalIndexBasedFocusStrategy';

const KEY_CODE_LEFT = 37;
const KEY_CODE_UP = 38;
const KEY_CODE_RIGHT = 39;
const KEY_CODE_DOWN = 40;
const KEY_CODE_SPACE = 32;

const tabsData = [
  'Tab 1',
  'Tab 2',
  'Tab 3',
  'Tab 4'
];
const menuData = [
  { id: 'menuItem1', text: 'MenuItem 1' },
  { id: 'menuItem2', text: 'MenuItem 2' },
  { id: 'menuItem3', text: 'MenuItem 3' },
  { id: 'menuItem4', text: 'MenuItem 4' },
  { id: 'menuItem5', text: 'MenuItem 5' },
  { id: 'menuItem6', text: 'MenuItem 6' },
  { id: 'menuItem7', text: 'MenuItem 7' }
];
const gridData = [
  { id: 'gridItem1', text: 'GridItem 1' },
  { id: 'gridItem2', text: 'GridItem 2' },
  { id: 'gridItem3', text: 'GridItem 3' },
  { id: 'gridItem4', text: 'GridItem 4' },
  { id: 'gridItem5', text: 'GridItem 5' },
  { id: 'gridItem6', text: 'GridItem 6' },
  { id: 'gridItem7', text: 'GridItem 7' },
  { id: 'gridItem8', text: 'GridItem 8' },
  { id: 'gridItem9', text: 'GridItem 9' },
  { id: 'gridItem10', text: 'GridItem 10' }
];

class Demo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      focusedTabIndex: null,
      focusedMenuItemId: null
    };
  }

  componentDidMount() {
    FocusManager.initializeFocus();
  }

  setFocusedTabIndex(index) {
    this.setState({
      focusedTabIndex: index
    });
  }
  setFocusedMenuItemId(menuItemId) {
    this.setState({
      focusedMenuItemId: menuItemId
    });
  }

  render() {
    const { focusedTabIndex, focusedMenuItemId } = this.state;

    return (
        <FocusableContainer focusStrategy={verticalIndexBasedFocusStrategy} >
          <TabBar
              focusStrategy={horizontalIndexBasedFocusStrategy}
              onBlur={() => this.setFocusedTabIndex(null)}
              tabsData={tabsData}
              activeTabIndex={focusedTabIndex}
              onTabFocused={(index) => this.setFocusedTabIndex(index)}
          />
          <div className="row">
            <FocusableContainer focusStrategy={verticalIndexBasedFocusStrategy} onBlur={() => this.setFocusedMenuItemId(null)} >
              <Menu
                  menuData={menuData}
                  activeItemId={focusedMenuItemId}
                  onMenuItemFocused={(menuItemId) => this.setFocusedMenuItemId(menuItemId)}
              />
            </FocusableContainer>
            <Grid gridData={gridData} />
          </div>
        </FocusableContainer>
    );
  }
}

ReactDOM.render(<Demo/>, document.getElementById('app'), () => {
  document.addEventListener('keydown', (event) => {
    let start;
    let end;

    switch (event.keyCode) {
      case KEY_CODE_UP:
        start = performance.now();
        FocusManager.doUp();
        end = performance.now();
        console.log(`FocusManager.doUp() took ${end - start} ms to complete`);
        break;

      case KEY_CODE_DOWN:
        start = performance.now();
        FocusManager.doDown();
        end = performance.now();
        console.log(`FocusManager.doDown() took ${end - start} ms to complete`);
        break;

      case KEY_CODE_LEFT:
        start = performance.now();
        FocusManager.doLeft();
        end = performance.now();
        console.log(`FocusManager.doLeft() took ${end - start} ms to complete`);
        break;

      case KEY_CODE_RIGHT:
        start = performance.now();
        FocusManager.doRight();
        end = performance.now();
        console.log(`FocusManager.doRight() took ${end - start} ms to complete`);
        break;

      case KEY_CODE_SPACE:
        start = performance.now();
        //FocusManager.doSelect();
        end = performance.now();
        console.log(`FocusManager.doSelect() took ${end - start} ms to complete`);
        break;
    }
  });
});
