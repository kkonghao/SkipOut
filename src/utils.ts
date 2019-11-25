import {CharacterSet} from './CharacterSet'
import {characterSetsToTabOutFrom} from './charactersToTabOutFrom'
import {window, Position, Selection, commands} from 'vscode';

export function returnHighest(num1:number, num2:number) : number
{
    return num1 > num2 ? num1: num2;
}

export function returnLowest(num1:number, num2:number) : number
{
    return num1 < num2 ? num1: num2;
}

export function oneNumberIsNegative(num1:number, num2:number) : boolean
{
    return (num1 <= -1 || num2 <= -1);    
}

export function getPreviousChar(currentPosition:number, text:string): string
{
    return text.substring(currentPosition-1, currentPosition);
}

export function getNextChar(currentPosition:number, text:string): string
{
    return text.substring(currentPosition+1, currentPosition);
}

export function determineNextSpecialCharPosition(charInfo: CharacterSet, text:string, position: number) : number
{
    let positionNextOpenChar = text.indexOf(charInfo.open, position + 1);
    
    if(positionNextOpenChar == -1)
    {
        positionNextOpenChar = text.indexOf(charInfo.close, position + 1);
    }
    
    if(positionNextOpenChar == -1)
    {
        //find first other special character    
        var strToSearchIn = text.substr(position);
        var counter = position;
        for (var char of strToSearchIn)
        {
            counter++;
            let info = characterSetsToTabOutFrom().find(c => c.open == char || c.close == char);
            
            if(info !== undefined)
            {
                positionNextOpenChar = counter;
                break;    
            }
        }
    }
    
    return positionNextOpenChar;
    
}

export function selectNextCharacter(text:string, position:number)
{
    let nextCharacter = getNextChar(position, text);
        let indxNext = characterSetsToTabOutFrom().find(o => o.open == nextCharacter || o.close == nextCharacter)
        if( indxNext !== undefined)
        {
            //no tab, put selection just AFTER the next special character 
            let nextCursorPosition = new Position(window.activeTextEditor.selection.active.line, position+1);
            return window.activeTextEditor.selection = new Selection(nextCursorPosition,nextCursorPosition );    
        }
        
        //Default
        commands.executeCommand("tab");
}