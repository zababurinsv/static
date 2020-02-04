import{css}from"styled-components";const getColor=(o,s)=>o?s.blue[0]:s.gray[2],fill=css`
    ${({isActive:o,theme:{colors:s}})=>css`
        fill: ${getColor(o,s)};
    `}
`;export const logoColor=css`
    cursor: pointer;
    rect {
        ${fill};
    }
`;export const iconColor=css`
    cursor: pointer;
    path {
        ${fill};
    }
`;