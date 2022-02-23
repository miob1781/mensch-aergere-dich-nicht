/** color of field or player */
export enum Player {
    /** player Yellow */
    Yellow = 'Yellow',
    /** player Red */
    Red = 'Red',
    /** player Green */
    Green = 'Green',
    /** player Blue */
    Blue = 'Blue',
    /** field is empty */
    None = 'None'
}

/** type of field */
export enum FieldType {
    /** board field */
    Board = 'board',
    /** start field */
    Start = 'start',
    /** home field */
    Home = 'home'
}

/** tuple returned by getMoveValues */
export type Move = [ExecuteMove, number]

/** tuple with values of move-specific fields */
export type MoveField = [number, FieldType]

/** contains values for each field */
export interface Field {
    /** field index */
    index: number,
    /** field type */
    type: FieldType,
    /** static value that is "None" if the field is a board field or else the color of the respectiv player */
    color: Player,
    /** dynamic value that is "None" if no player is on the field or else the color of the respectiv player */
    player: Player,
    /** grid number of row */
    row: number,
    /** grid number of column */
    column: number,
    /** array of indices of the pieces to isMoveFrom or isMoveTo applies */
    figIndexArray: number[],
    /** piece can move from this field */
    isMoveFrom: boolean,
    /** piece can move to this field */
    isMoveTo: boolean,
    /** function that is executed if a move from this field is selected */
    executeMove: ExecuteMove|null
}

/** object with home or start fields, as opposed to the array with board fields */
export interface HomeOrStartFields {
    /** home or start fields of an individual player */
    [color: string]: Field[]
}

/** values of individual player */
export interface StartPlayer {
    /** player takes part in the game? */
    plays: boolean,
    /** player is played by computer? */
    computerPlays: boolean
}

/** state of startSlice */
export interface StartState {
    /** game on? */
    gameOn: boolean,
    /** contains values for players as to whether they play and are played by the computer */
    players: {[color: string]: StartPlayer}
}

//** contains values of individual pieces */
export interface Fig {
    /** index of piece */
    figIndex: number,
    /** player to which the piece belongs */
    player: Player,
    /** type of field on which the piece is standing */
    type: FieldType,
    /** index of field on which the piece is standing */
    fieldIndex: number
}

/** contains positions and other positional values of a player */
export interface Positions {
    /** positions of the player's pieces */
    positions: Fig[],
    /** number of pieces out of the start area */
    numFigsOut: number,
    /** last free home field of the player */
    lastFreeHomeField: number
}

/** object that is dispatched to clean up after a move */
export interface UpdateFieldAfterMove {
    /** field index */
    fieldIndex: number,
    /** field type */
    type: FieldType,
    /** player */
    player: Player
}

/** object that is dispatched to update a position */
export interface UpdatePosition {
    /** player */
    player: Player,
    /** index of piece */
    figIndex: number,
    /** field index */
    fieldIndex: number,
    /** field type */
    type: FieldType,
    /** does the move change the number of pieces out of the start area? */
    changeNumFigsOut: string|null,
    /** is there a new last free home field? */
    decrementLastFreeHomeField: boolean
}

/** object returned by the checkHit function, which checks if a piece is sent back to the start */
export interface CheckHit {
    /** object with values of the field to which the piece is sent back */
    oppFieldObject: UpdateFieldAfterMove,
    /** object with values of the opponent's position */
    oppPlayerObject: UpdatePosition
}

/** values for the execution of a move */
export interface ExecuteMove {
    /** is this the winning move? */
    winning: boolean,
    /** object with values if a piece is hit */
    checkHitObject?: CheckHit,
    /** object with values to update the current field after a move */
    updateFieldAfterMoveObject: UpdateFieldAfterMove,
    /** object with values to update the next field after a move */
    updateNextFieldAfterMoveObject: UpdateFieldAfterMove,
    /** object with values to update the player's position after a move */
    updatePositionObject: UpdatePosition
}

/** object that is dispatched to update the Board state with values of potential moves */
export interface UpdateField {
    /** field index */
    fieldIndex: number,
    /** field type */
    type: FieldType,
    /** field from which a piece can move? */
    isMoveFrom: boolean,
    /** field to which a piece can move? */
    isMoveTo: boolean,
    /** piece index */
    figIndex: number,
    /** object of values needed for the execution of a move */
    executeMove: ExecuteMove|null
}

/** state of BoardSlice */
export interface BoardState {
    /** array of board fields */
    boardFields: Field[],
    /** object of start fields */
    startFields: HomeOrStartFields,
    /** object of home fields */
    homeFields: HomeOrStartFields,
    /** positions of all players */
    allPositions: {[color: string]: Positions},
    /** potential moves if any */
    moves?: Move[],
    /** values of move-related fields */
    moveFields?: MoveField[],
    /** dice value */
    dice: number,
    /** player who is on */
    playerOn: Player,
    /** has the dice been thrown? */
    diceThrown: boolean,
    /** have we got moves? */
    gotMoves: boolean,
    /** are we ready to clean up? */
    readyToCleanUp: boolean,
    /** can we go to the next player? */
    goToNextPlayer: boolean,
    /** number of times the dice has been thrown if the player is allowed up to three times */
    diceCount: number,
    /** player who has won the game, if any */
    hasWon?: Player,
    /** is the mouse over a field from which a player can move? */
    mouseOverMoveFrom: boolean,
    /** figIndex if mouseOverMoveFrom */
    figIndexMouse?: number
}
