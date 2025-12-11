function findShipAtCell(ships, pos) {
    const foundShip = ships.find(
        (ship, index) => ship.cells.some(cell => cell.c === pos.r && cell.r === pos.c)
    )

    if (!foundShip) return {ship: undefined, hitCell: undefined};

    const hitCell = foundShip.cells.find(cell => cell.c === pos.r && cell.r === pos.c)

    return {foundShip, hitCell}
}

module.exports = {
    findShipAtCell
}