import { G } from 'svg.js'
import { Alterations} from '@/Notation/NoteConstants'
import { INoteData} from '@/Notation/NoteData'
import AbstractMusicElement from './AbstractMusicDrawing'
import AbstractStaff from '@/MusicElements/Staff/AbstractStaff'
const noteSVG = require('@/assets/images/quarter.svg')
const noteSharpSVG = require('@/assets/images/quarter_sharp.svg')
const noteFlatSVG = require('@/assets/images/quarter_flat.svg')

/**
 * Just a quarter note (for now)
 */
export default class Note extends AbstractMusicElement {
    public static readonly NOTE_HEIGHT = 50
    public  fadingOut = false
    
    private noteRepresentation: INoteData
    
    constructor(note: INoteData) {
        super((() => {
            switch (note.alt) {
                case Alterations.flat:
                    return noteFlatSVG
                case Alterations.sharp:
                    return noteSharpSVG
                case Alterations.natural:
                    return noteSVG
                default:
                    throw new Error('Note not defined')
            }
        })())
        this.noteRepresentation = note
        
    }
    
    public get getNoteRepresentation(): INoteData {
        return this.noteRepresentation
    }
    
    public draw(x: number, y: number, sizeRatio?: number) {       
        super.draw(x, y, sizeRatio)    
    }    
     
    /**
     * Get the width of the note
     */
    get width() {
        return this.element.bbox().w
    }

    /**
     * Set the width of the note
     */
    get height() {
        return this.element.bbox().h
    }

    /**
     * Set the element color
     * @param color
     */
    public fill(color: string) {
        this.element.fill(color)
    }

    public fadeOutNote() {
        this.fadingOut = true
        this.fadeOut(500)
    }
}