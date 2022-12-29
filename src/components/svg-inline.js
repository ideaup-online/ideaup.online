import React from 'react';

const SvgInline = (props) => {
  return (
    <div className={props.className} id={props.id}>
      {props.component && props.component()}
    </div>
  );
};

export default SvgInline;
