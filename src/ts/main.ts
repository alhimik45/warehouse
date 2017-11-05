import {GameManager} from "./GameManager";
import {GameLogicFacade} from "./GameLogicFacade";

$(()=> {
    let _ = new GameManager(new GameLogicFacade());
});