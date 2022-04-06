import React from 'react'
import './Card.scss';

const Card = (props) => {
    const { card } = props;
    return (
        <>
            <div className="Card">
                { card.image &&
                    <img
                        className="card-cover"
                        src={ card.image }
                        alt="Item"
                        onMouseDown={ e => e.preventDefault() }
                    />
                }
                { card.title }
            </div>
        </>
    )
}

export default Card