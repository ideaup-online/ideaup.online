import React, { useEffect } from 'react';
import styled from '@emotion/styled';
import smartquotes from 'smartquotes-ts';

//
// Field Control Group styles
//

const FieldControlGroup = styled.div`
  grid-area: control-group;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-areas: 'control';
  height: 2em;
`;

const FieldRightDecoratedControlGroup = styled(FieldControlGroup)`
  grid-template-columns: 1fr auto;
  grid-template-areas: 'control decorator';
`;

const FieldLeftDecoratedControlGroup = styled(FieldControlGroup)`
  grid-template-columns: auto 1fr;
  grid-template-areas: 'decorator control';
`;

const FieldDoubleControlGroup = styled(FieldControlGroup)`
  grid-template-columns: 1fr auto 1fr;
  grid-template-areas: 'control decorator-middle control2';
`;

const FieldDoubleRightDecoratedControlGroup = styled(FieldControlGroup)`
  grid-template-columns: 1fr auto 1fr auto;
  grid-template-areas: 'control decorator-middle control2 decorator';
`;

const FieldDoubleLeftDecoratedControlGroup = styled(FieldControlGroup)`
  grid-template-columns: auto 1fr auto 1fr;
  grid-template-areas: 'decorator control decorator-middle control2';
`;

//
// Field Control styles
//

const FieldControl = styled.input`
  grid-area: control;
  border: none;
  border-bottom-left-radius: 0.4em;
  border-bottom-right-radius: 0.4em;
  height: inherit;
  outline: none;
  padding-left: 1em;
  padding-right: 0.25em;
  font-size: 0.9em;
  background: var(--enabled-field-bg-color);
  color: var(--enabled-field-fg-color);
  font-family: Solway, san-serif;
  width: 100%;
  box-sizing: border-box;
  text-align: center;
`;

const FieldControlRO = styled(FieldControl)`
  background: var(--disabled-field-bg-color);
  color: var(--disabled-field-fg-color);
`;

const FieldRightDecoratedControl = styled(FieldControl)`
  border-bottom-left-radius: 0.4em;
  border-bottom-right-radius: 0;
`;

const FieldRightDecoratedControlRO = styled(FieldRightDecoratedControl)`
  background: var(--disabled-field-bg-color);
  color: var(--disabled-field-fg-color);
`;

const FieldLeftDecoratedControl = styled(FieldControl)`
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0.4em;
`;

const FieldLeftDecoratedControlC2 = styled(FieldLeftDecoratedControl)`
  grid-area: control2;
`;

const FieldLeftDecoratedControlRO = styled(FieldLeftDecoratedControl)`
  background: var(--disabled-field-bg-color);
  color: var(--disabled-field-fg-color);
`;

const FieldLeftDecoratedControlROC2 = styled(FieldLeftDecoratedControlRO)`
  grid-area: control2;
`;

const FieldDoubleDecoratedControl = styled(FieldControl)`
  border-radius: 0;
`;

const FieldDoubleDecoratedControlC2 = styled(FieldDoubleDecoratedControl)`
  grid-area: control2;
`;

const FieldDoubleDecoratedControlRO = styled(FieldDoubleDecoratedControl)`
  background: var(--disabled-field-bg-color);
  color: var(--disabled-field-fg-color);
`;

const FieldDoubleDecoratedControlROC2 = styled(FieldDoubleDecoratedControlRO)`
  grid-area: control2;
`;

//
// Field Decorator styles
//

const FieldMiddleDecorator = styled.div`
  grid-area: decorator-middle;
  display: grid;
  align-items: center;
  justify-items: center;
  white-space: nowrap;
  vertical-align: middle;
  color: var(--base-color);
  background: var(--fancy-field-dark-color);
  padding-left: 0.5em;
  padding-right: 0.5em;
  font-family: Solway, san-serif;
  border-radius: 0;
`;

const FieldRightDecorator = styled(FieldMiddleDecorator)`
  grid-area: decorator;
  border-bottom-right-radius: 0.4em;
  min-width: 2em;
`;

const FieldLeftDecorator = styled(FieldMiddleDecorator)`
  grid-area: decorator;
  border-bottom-left-radius: 0.4em;
  min-width: 2em;
`;

//
// Field Label style
//

const FieldLabel = styled.span`
  display: grid;
  align-items: center;
  justify-self: stretch;
  grid-area: label;
  vertical-align: middle;
  padding: 0.25em;
  padding-left: 0.5em;
  color: var(--base-color);
  background: var(--fancy-field-dark-color);
  border-top-left-radius: 0.4em;
  border-top-right-radius: 0.4em;
  border-bottom: solid 1px;
  border-bottom-color: rgba(255, 127, 80, 0.6);
`;

//
// FieldContainer style
//

const FieldContainer = styled.div``;

//
// Single Field component and associated
// style
//

const NakedField = (props: any): JSX.Element => {
  const isReadOnly =
    props.inputProps.readOnly !== null ? props.inputProps.readOnly : false;

  let Group, Control, Decorator;
  if (props.decorator) {
    if (props.decoratorPosition && props.decoratorPosition === 'left') {
      Group = FieldLeftDecoratedControlGroup;
      if (isReadOnly) {
        Control = FieldLeftDecoratedControlRO;
      } else {
        Control = FieldLeftDecoratedControl;
      }
      Decorator = FieldLeftDecorator;
    } else {
      Group = FieldRightDecoratedControlGroup;
      if (isReadOnly) {
        Control = FieldRightDecoratedControlRO;
      } else {
        Control = FieldRightDecoratedControl;
      }
      Decorator = FieldRightDecorator;
    }
    return (
      <FieldContainer className={props.className}>
        <FieldLabel>{String(smartquotes(props.label))}</FieldLabel>
        <Group>
          <Control
            id={props.inputProps.id}
            type={props.inputProps.type}
            defaultValue={props.inputProps.defaultValue}
            onFocus={props.inputProps.onFocus}
            onBlur={props.inputProps.onBlur}
            onChange={props.inputProps.onChange}
            readOnly={isReadOnly}
          />
          <Decorator>{String(smartquotes(props.decorator))}</Decorator>
        </Group>
      </FieldContainer>
    );
  } else {
    if (isReadOnly) {
      Control = FieldControlRO;
    } else {
      Control = FieldControl;
    }
    return (
      <FieldContainer className={props.className}>
        <FieldLabel>{String(smartquotes(props.label))}</FieldLabel>
        <FieldControlGroup>
          <Control
            id={props.inputProps.id}
            type={props.inputProps.type}
            defaultValue={props.inputProps.defaultValue}
            onFocus={props.inputProps.onFocus}
            onBlur={props.inputProps.onBlur}
            onChange={props.inputProps.onChange}
            readOnly={isReadOnly}
          />
        </FieldControlGroup>
      </FieldContainer>
    );
  }
};

export const Field = styled(NakedField)`
  display: grid;
  grid-template-areas:
    'label'
    'control-group';
  padding: 0.5em;
`;

//
// Double Field component and associated
// style
//

const NakedDoubleField = (props: any): JSX.Element => {
  const isLeftReadOnly =
    props.inputPropsLeft.readOnly !== null
      ? props.inputPropsLeft.readOnly
      : false;
  const isRightReadOnly =
    props.inputPropsRight.readOnly !== null
      ? props.inputPropsRight.readOnly
      : false;

  let Group, Control1, Control2, Decorator;
  if (props.decorator) {
    if (props.decoratorPosition && props.decoratorPosition === 'left') {
      Group = FieldDoubleLeftDecoratedControlGroup;
      if (isLeftReadOnly) {
        Control1 = FieldDoubleDecoratedControlRO;
      } else {
        Control1 = FieldDoubleDecoratedControl;
      }
      if (isRightReadOnly) {
        Control2 = FieldLeftDecoratedControlROC2;
      } else {
        Control2 = FieldLeftDecoratedControlC2;
      }
      Decorator = FieldLeftDecorator;
    } else {
      Group = FieldDoubleRightDecoratedControlGroup;
      if (isLeftReadOnly) {
        Control1 = FieldRightDecoratedControlRO;
      } else {
        Control1 = FieldRightDecoratedControl;
      }
      if (isRightReadOnly) {
        Control2 = FieldDoubleDecoratedControlROC2;
      } else {
        Control2 = FieldDoubleDecoratedControlC2;
      }
      Decorator = FieldRightDecorator;
    }
    return (
      <FieldContainer className={props.className}>
        <FieldLabel>{String(smartquotes(props.label))}</FieldLabel>
        <Group>
          <Control1
            id={props.inputPropsLeft.id}
            type={props.inputPropsLeft.type}
            defaultValue={props.inputPropsLeft.defaultValue}
            onFocus={props.inputPropsLeft.onFocus}
            onBlur={props.inputPropsLeft.onBlur}
            onChange={props.inputPropsLeft.onChange}
            readOnly={isLeftReadOnly}
          />
          <FieldMiddleDecorator>
            {String(smartquotes(props.middleDecorator))}
          </FieldMiddleDecorator>
          <Control2
            id={props.inputPropsRight.id}
            type={props.inputPropsRight.type}
            defaultValue={props.inputPropsRight.defaultValue}
            onFocus={props.inputPropsRight.onFocus}
            onBlur={props.inputPropsRight.onBlur}
            onChange={props.inputPropsRight.onChange}
            readOnly={isRightReadOnly}
          />
          <Decorator>{String(smartquotes(props.decorator))}</Decorator>
        </Group>
      </FieldContainer>
    );
  } else {
    Control1 = FieldRightDecoratedControl;
    Control2 = FieldLeftDecoratedControl;
    if (isLeftReadOnly) {
      Control1 = FieldRightDecoratedControlRO;
    }
    if (isRightReadOnly) {
      Control2 = FieldLeftDecoratedControlRO;
    }
    return (
      <FieldContainer className={props.className}>
        <FieldLabel>{String(smartquotes(props.label))}</FieldLabel>
        <FieldDoubleControlGroup>
          <Control1
            id={props.inputPropsLeft.id}
            type={props.inputPropsLeft.type}
            defaultValue={props.inputPropsLeft.defaultValue}
            onFocus={props.inputPropsLeft.onFocus}
            onBlur={props.inputPropsLeft.onBlur}
            onChange={props.inputPropsLeft.onChange}
            readOnly={isLeftReadOnly}
          />
          <FieldMiddleDecorator>
            {String(smartquotes(props.middleDecorator))}
          </FieldMiddleDecorator>
          <Control2
            id={props.inputPropsRight.id}
            type={props.inputPropsRight.type}
            defaultValue={props.inputPropsRight.defaultValue}
            onFocus={props.inputPropsRight.onFocus}
            onBlur={props.inputPropsRight.onBlur}
            onChange={props.inputPropsRight.onChange}
            readOnly={isRightReadOnly}
          />
        </FieldDoubleControlGroup>
      </FieldContainer>
    );
  }
};

export const DoubleField = styled(NakedDoubleField)`
  display: grid;
  grid-template-areas:
    'label'
    'control-group';
  padding: 0.5em;
`;

//
// Drop Down Select component and associated
// style
//

const CustomSelect = styled.div`
  position: relative;
  grid-area: control;
  display: grid;
  justify-items: center;
  align-items: center;
  border-bottom-left-radius: 0.4em;
  border-bottom-right-radius: 0;
  font-size: 0.9em;
  background: var(--enabled-field-bg-color);
  color: var(--fancy-field-dark-color);
  font-family: Solway, san-serif;
  cursor: pointer;

  select {
    display: none;
  }

  .select-item {
    border: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    outline: none;
    padding-top: 0.5em;
    padding-bottom: 0.5em;
    width: 100%;
    box-sizing: border-box;
    text-align: center;
    color: var(--fancy-field-dark-color);
    font-family: Solway, san-serif;
    border: 1px solid transparent;
    border-color: transparent transparent rgba(0, 0, 0, 0.1) transparent;
    cursor: pointer;
  }

  .same-as-selected {
    background: var(--field-selected-item-bg-color);
    color: var(--field-selected-item-fg-color);
  }

  .select-items {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    z-index: 99;
    background: var(--enabled-field-bg-color);
    border-bottom-left-radius: 0.4em;
    border-bottom-right-radius: 0.4em;
  }

  .select-hide {
    display: none;
  }
`;

const DropArrow = styled(FieldRightDecorator)`
  cursor: pointer;
`;

const NakedDropDownSelectField = (props: any): JSX.Element => {
  const Group = FieldRightDecoratedControlGroup;

  function close() {
    const customSelect = document.getElementById(
      props.inputProps.id + '-custom-select',
    );
    const optionList = document.getElementById(
      props.inputProps.id + '-option-list',
    );
    const decorator = document.getElementById(
      props.inputProps.id + '-decorator',
    );

    if (customSelect && optionList && decorator) {
      customSelect.style.borderBottomLeftRadius = '0.4em';
      optionList.classList.add('select-hide');
      decorator.innerText = '▽';
    }
  }

  function toggleOpen(e: MouseEvent) {
    // When the select box is clicked,
    // toggle its open state
    e.stopPropagation();

    const customSelect = document.getElementById(
      props.inputProps.id + '-custom-select',
    );
    const optionList = document.getElementById(
      props.inputProps.id + '-option-list',
    );
    const decorator = document.getElementById(
      props.inputProps.id + '-decorator',
    );

    if (customSelect && optionList && decorator) {
      if (optionList.classList.contains('select-hide')) {
        // Open
        customSelect.style.borderBottomLeftRadius = '0';
        optionList.classList.remove('select-hide');
        decorator.innerText = '△';
      } else {
        // Close
        customSelect.style.borderBottomLeftRadius = '0.4em';
        optionList.classList.add('select-hide');
        decorator.innerText = '▽';
      }
    }
  }

  useEffect(() => {
    // Grab our custom select element
    const customSelect = document.getElementById(
      props.inputProps.id + '-custom-select',
    );
    if (customSelect) {
      // Grab the child select element
      const selectElement = customSelect.getElementsByTagName('select')[0];

      // Create a new DIV that will act as the selected item
      const selectedItem = document.createElement('DIV');
      selectedItem.setAttribute('class', 'current-select-item');
      selectedItem.innerHTML =
        selectElement.options[selectElement.selectedIndex].innerHTML;
      customSelect.appendChild(selectedItem);

      // Create a new DIV that will contain the option list
      const optionList = document.createElement('DIV');
      optionList.setAttribute('id', props.inputProps.id + '-option-list');
      optionList.setAttribute('class', 'select-items select-hide');
      for (let j = 0; j < selectElement.length; j++) {
        // For each option in the original select element,
        // create a new DIV that will act as an option item
        const optionItem = document.createElement('DIV');
        if (j === selectElement.selectedIndex) {
          optionItem.setAttribute('class', 'select-item same-as-selected');
        } else {
          optionItem.setAttribute('class', 'select-item');
        }
        optionItem.innerHTML = selectElement.options[j].innerHTML;
        optionItem.addEventListener('click', function (e: MouseEvent) {
          // When an item is clicked, update the original select box
          // and selected item
          const target = e.target as HTMLElement;
          if (target) {
            let previouslySelectedItems, i, k;
            const selectElement = (
              target.parentNode?.parentNode as HTMLElement
            )?.getElementsByTagName('select')[0];
            const selectedItem = target.parentNode?.previousSibling;
            for (i = 0; i < selectElement.length; i++) {
              if (selectElement.options[i].innerHTML === this.innerHTML) {
                if (selectElement.selectedIndex !== i) {
                  selectElement.selectedIndex = i;
                  props.inputProps.onChange();
                }
                if (selectedItem) {
                  (selectedItem as HTMLElement).innerHTML = this.innerHTML;
                }
                previouslySelectedItems = (
                  target.parentNode as HTMLElement
                )?.getElementsByClassName('same-as-selected');
                for (k = 0; k < previouslySelectedItems.length; k++) {
                  previouslySelectedItems[k].classList.remove(
                    'same-as-selected',
                  );
                }
                target.classList.add('same-as-selected');
                break;
              }
            }
          }
        });
        optionList.appendChild(optionItem);
      }
      customSelect.appendChild(optionList);
      customSelect.addEventListener('click', toggleOpen);
    }

    // Toggle opening the box when the decorator is
    // clicked also
    document
      .getElementById(props.inputProps.id + '-decorator')
      ?.addEventListener('click', toggleOpen);

    // If the user clicks anywhere outside the select box,
    // then close it
    document.addEventListener('click', close);
  });

  return (
    <FieldContainer className={props.className}>
      <FieldLabel>{String(smartquotes(props.label))}</FieldLabel>
      <Group>
        <CustomSelect id={props.inputProps.id + '-custom-select'}>
          <select
            id={props.inputProps.id}
            onFocus={props.inputProps.onFocus}
            onBlur={props.inputProps.onBlur}
            onChange={props.inputProps.onChange}
            value={props.inputProps.items[0]}
          >
            {props.inputProps.items.map((item: any, idx: number) => {
              return (
                <option value={idx} key={idx}>
                  {item}
                </option>
              );
            })}
          </select>
        </CustomSelect>
        <DropArrow id={props.inputProps.id + '-decorator'}>▽</DropArrow>
      </Group>
    </FieldContainer>
  );
};

export const DropDownSelectField = styled(NakedDropDownSelectField)`
  display: grid;
  grid-template-areas:
    'label'
    'control-group';
  padding: 0.5em;
`;

export const Button = styled.button`
  text-align: middle;
  font-size: 1.5em;
  -webkit-appearance: none;
  background-color: initial;
  border: none;
  cursor: pointer;
  outline: none;
  display: grid;
  align-items: center;
  justify-self: stretch;
  grid-area: label;
  vertical-align: middle;
  margin: 0.5em;
  padding: 0.25em;
  padding-left: 0.5em;
  padding-right: 0.5em;
  color: var(--base-color);
  background: var(--fancy-field-dark-color);
  border-radius: 0.4em;

  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
`;
