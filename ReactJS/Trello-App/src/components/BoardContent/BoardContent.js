import React, { useEffect, useState, useRef } from 'react';
import Column from '../Column/Column';
import { initData } from '../../actions/initData'
import { Container, Draggable } from "react-smooth-dnd";
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid'
import { mapOrder } from '../../utilities/sorts';
import './BoardContent.scss';
import { applyDrag } from '../../utilities/dragDrop';

const BoardContent = () => {
    const [board, setBoard] = useState({});
    const [columns, setColumns] = useState([])

    const [isShowAddList, setIsShowAddList] = useState(false);
    const inputRef = useRef(null);
    const [valueInput, setValueInput] = useState("");

    useEffect(() => {
        if (isShowAddList === true & inputRef && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isShowAddList]);


    useEffect(() => {
        const boardInitData = initData.boards.find(item => item.id === 'board-1');
        if (boardInitData) {
            setBoard(boardInitData);

            // Sort columns
            setColumns(mapOrder(boardInitData.columns, boardInitData.columnOrder, 'id'));
        }
    }, []);


    if (_.isEmpty(board)) {
        return (
            <>
                <div className="notfound">
                    Board not Found
                </div>
            </>
        )
    }

    const onColumnDrop = (dropResult) => {
        let newColumns = [...columns];
        newColumns = applyDrag(newColumns, dropResult);

        let newBoard = { ...board };
        newBoard.columnOrder = newColumns.map(column => column.id);
        newBoard.columns = newColumns;

        setColumns(newColumns);
        setBoard(newBoard);
    }

    const onCardDrop = (dropResult, columnId) => {
        if (dropResult.removeIndex !== null || dropResult.addedIndex !== null) {
            let newColumns = [...columns];

            let currentColumn = newColumns.find(column => column.id === columnId);
            currentColumn.cards = applyDrag(currentColumn.cards, dropResult);
            currentColumn.cardOrder = currentColumn.cards.map(card => card.id);

            setColumns(newColumns);
        }
    }

    const handleAddList = () => {
        if (!valueInput) {
            if (inputRef && inputRef.current) {
                inputRef.current.focus();
            }
            return;
        }

        // Updated board Columns
        const _columns = _.cloneDeep(columns);
        _columns.push({
            id: uuidv4(),
            boardId: board.id,
            title: valueInput,
            cards: []
        });
        setColumns(_columns);
        setValueInput("");
        inputRef.current.focus();
    }

    const onUpdateColumn = (newColumn) => {
        console.log(newColumn)
        const columnIdUpdate = newColumn.id;
        // Original Columns
        let nCols = [...columns];
        let index = nCols.findIndex(item => item.id === columnIdUpdate);
        if (newColumn._destroy) {
            // Remove column
            nCols.splice(index, 1);
        } else {
            // Update Column
            nCols[index] = newColumn;
        }
        setColumns(nCols);
    }

    return (
        <>
            <div className="board-columns">
                <Container
                    orientation="horizontal"
                    onDrop={ onColumnDrop }
                    getChildPayload={ index => columns[index] }
                    dragHandleSelector=".column-drag-handle"
                    dropPlaceholder={ {
                        animationDuration: 150,
                        showOnTop: true,
                        className: 'column-drop-preview'
                    } }
                >
                    { columns && columns.length > 0 && columns.map((column, index) => {
                        return (
                            <Draggable key={ column.id }>
                                <Column
                                    column={ column }
                                    onCardDrop={ onCardDrop }
                                    onUpdateColumn={ onUpdateColumn }
                                />
                            </Draggable>
                        )
                    }) }
                </Container >

                { isShowAddList === false ?
                    <div
                        className="add-new-colum"
                        onClick={ () => setIsShowAddList(true) }
                    >
                        <i className="fa fa-plus icon"></i>&nbsp;
                        Add another column
                    </div>
                    :
                    <div className="content-addColumn">
                        <input
                            type="text"
                            className="form-control"
                            placeholder=""
                            ref={ inputRef }
                            value={ valueInput }
                            onChange={ (e) => setValueInput(e.target.value) }
                        />
                        <div className="group-button">
                            <button
                                className="btn btn-success"
                                onClick={ () => handleAddList() }
                            >
                                Add List
                            </button>
                            <i
                                className="fa fa-times icon"
                                onClick={ () => setIsShowAddList(false) }
                            ></i>
                        </div>
                    </div>
                }
            </div>


        </>
    )
}

export default BoardContent;