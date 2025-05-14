import React from 'react'
import styl from '../styles/WorkTile.module.css'
import {useDraggable} from "@dnd-kit/core";

const WorkTile = ({id,title}:{id:string;title:string}) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });
    const style = {
        transform: transform
            ? `translate(${transform.x}px, ${transform.y}px)`
            : undefined,
    };

    return <div ref={setNodeRef} {...listeners} {...attributes}  className={styl.container} style={style}>{title}</div>;
}

export default WorkTile