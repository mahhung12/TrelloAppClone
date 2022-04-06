import React, { useState, useEffect, useRef } from 'react'
import Card from '../Card/Card';
import { mapOrder } from '../../utilities/sorts'
import { Container, Draggable } from "react-smooth-dnd";
import Dropdown from 'react-bootstrap/Dropdown';
import Form from 'react-bootstrap/Form'
import ComfirmModal from '../Common/ConfirmModal'
import { v4 as uuidv4 } from 'uuid'
import { MODAL_ACTION_CLOSE, MODAL_ACTION_CONFIRM } from '../../utilities/constant'

import './Column.scss'

const Column = (props) => {
    const { column, onCardDrop, onUpdateColumn } = props;
    const cards = mapOrder(column.cards, column.cardOrder, 'id');

    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [titleColumn, setTitleColumn] = useState("");
    const [isFirstClick, setIsFirstClick] = useState(true);
    const [isShowAddNewCard, setIsShowAddNewCard] = useState(false);
    const [valueTextArea, setValueTextArea] = useState("");
    const textAreaRef = useRef();
    const inputRef = useRef(null);

    useEffect(() => {
        if (isShowAddNewCard === true && textAreaRef && textAreaRef.current) {
            textAreaRef.current.focus();
        }
    }, [isShowAddNewCard]);

    useEffect(() => {
        if (column && column.title) {
            setTitleColumn(column.title);
        }
    }, [column]);

    const toggleModal = () => {
        setIsShowModalDelete(!isShowModalDelete);
    }

    const onConfirmModalAction = (type) => {
        if (type === MODAL_ACTION_CLOSE) {
            // Doing nothing
        }

        else if (type === MODAL_ACTION_CONFIRM) {
            // Remove a column
            const newColumn = {
                ...column,
                _destroy: true
            }
            onUpdateColumn(newColumn);
        }
        toggleModal();
    }

    const selectAllText = (event) => {
        setIsFirstClick(false);

        if (isFirstClick) {
            event.target.select();
        } else {
            inputRef.current.setSelectionRange(titleColumn.length, titleColumn.length);
        }
        // event.target.focus();
    }

    const handleClickOutside = () => {
        // Do something...
        setIsFirstClick(true);

        const newColumn = {
            ...column,
            title: titleColumn,
            _destroy: false
        }
        onUpdateColumn(newColumn);
    }

    const handleAddNewCard = () => {
        // Doing someting here...
        if (!valueTextArea) {
            textAreaRef.current.focus();
            return;
        }

        const newCard = {
            id: uuidv4(),
            boardId: column.boardId,
            columnId: column.id,
            title: valueTextArea,
            image: null
        }

        let newColumn = { ...column };
        newColumn.cards = [...newColumn.cards, newCard];
        newColumn.cardOrder = newColumn.cards.map(card => card.id);

        onUpdateColumn(newColumn);
        setValueTextArea("");
        setIsShowAddNewCard(false);
    }

    return (
        <>
            <div className="column">
                <header className="column-drag-handle">
                    <div className="column-title">
                        <Form.Control
                            size={ "sm" }
                            type="text"
                            value={ titleColumn }
                            className="customize-input-column"
                            onClick={ selectAllText }
                            onChange={ (e) => setTitleColumn(e.target.value) }
                            spellCheck="false"
                            onBlur={ handleClickOutside }
                            onMouseDown={ (e) => e.preventDefault() }
                            ref={ inputRef }
                        />
                    </div>

                    <div className="column-dropdown">
                        <Dropdown>
                            <Dropdown.Toggle variant="" id="dropdown-basic" size="sm" />
                            <Dropdown.Menu>
                                <Dropdown.Item href="#">Add Card</Dropdown.Item>
                                <Dropdown.Item onClick={ toggleModal }>Remove</Dropdown.Item>
                                <Dropdown.Item href="#">Rename</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </header >
                <div className="cards-list">
                    <Container
                        groupName="col"
                        onDrop={ (dropResult) => onCardDrop(dropResult, column.id) }
                        getChildPayload={ index => cards[index] }
                        dragClass="card-ghost"
                        dropClass="card-ghost-drop"
                        dropPlaceholder={ {
                            animationDuration: 150,
                            showOnTop: true,
                            className: 'card-drop-preview'
                        } }
                        dropPlaceholderAnimationDuration={ 200 }
                    >

                        { cards && cards.length > 0 && cards.map((card, index) => {
                            return (
                                <Draggable key={ card.id }>
                                    <Card card={ card } />
                                </Draggable>
                            )
                        }) }
                    </Container>
                    { isShowAddNewCard === true &&
                        <div className="add-new-card">
                            <textarea
                                row="2.5"
                                className="form-control"
                                placeholder="Enter a title for this card..."
                                ref={ textAreaRef }
                                value={ valueTextArea }
                                onChange={ (e) => setValueTextArea(e.target.value) }
                            >

                            </textarea>
                            <div className="group-button">
                                <button
                                    className="btn btn-primary"
                                    onClick={ () => handleAddNewCard() }
                                >
                                    Add List
                                </button>
                                <i
                                    className="fa fa-times icon"
                                    onClick={ () => setIsShowAddNewCard(false) }
                                ></i>
                            </div>
                        </div>
                    }
                </div>
                { isShowAddNewCard === false &&
                    <footer>
                        <div
                            className="footer-action"
                            onClick={ () => setIsShowAddNewCard(true) }
                        >
                            <i className="fa fa-plus icon"></i>
                            &nbsp;
                            Add another card
                        </div>
                    </footer>
                }
            </div >

            <ComfirmModal
                show={ isShowModalDelete }
                title={ "Remove a Column" }
                content={ `Are u sure to remove this column: <b> ${column.title} </b> ` }
                onAction={ onConfirmModalAction }
            />
        </>
    )
}

export default Column;
