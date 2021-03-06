import { Note, PianoKey, Alterations as Alt, PentegramNote as Pen } from '@/Notation/NoteConstants'
import { KeySignaturesData, KeySignaturesIndex, KeySignatureType } from '@/Notation/KeySignatures'
import { NoteData, INotePitch, INoteData, INoteDataObject } from './NoteData'
import fastClone from 'fast-clone'

export interface PitchesCollection {

    [index: string]: INotePitch
}

/**
 * Class to generate the different pitches and their corresponding midi value
 * When a key signature is applied the pitch refers to another value
 */
export class Pitches {
    protected notesInt: PitchesCollection = {}

    public get notes() {
        if (!this.notesInt) {
            throw new Error('Invalid notes')
        }
        return this.notesInt
    }

    public initialize(
        signature: KeySignaturesIndex | null,
        startNote: INotePitch | null,
        endNote: INotePitch | null
    ) {
        return this.generateNotes(signature, startNote, endNote)
    }

    protected generateNotes(
        signature: KeySignaturesIndex | null,
        startNote: INotePitch | null,
        endNote: INotePitch | null) {
        let skipFlag = 0

        const postFixList = ['_1', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

        const NewNoteData = fastClone(NoteData)
        if (signature !== null) {
            this.applyKeySignature(signature, NewNoteData)
        }

        let octave = 0
        for (const post of postFixList) {
            const noteDataKeys = Object.keys(NewNoteData)
            for (const key of noteDataKeys) {
                /**
                 * Should have used slice @todo
                 */
                if (++skipFlag < 2) { continue } // CF_1 doesnt exist
                let newData: INotePitch
                const newKey = Note[Number(key)] + post // string C_1, C0, ... G9
                newData = Object.assign({}, Object(NewNoteData[key]))

                newData.pitch = newKey
                /**
                 * The midi value grows as the note it refers to changes
                 * a lot of notes are enharmonics, so they are the same,
                 * and the midi value shouldnt change
                 * 12 is the size of max value each octave not counting
                 * BS that is actually the first note of the next one
                 */
                newData.midiValue = (octave * 12) + (newData.noteVal) - 1

                /**
                 * The user selects a start and endnote interval for each staff
                 * the notes above and below are not necessary
                 */
                if (startNote && endNote) {
                    if (
                        newData.midiValue < startNote.midiValue
                        || newData.midiValue > endNote.midiValue) {
                        continue
                    }
                }

                newData.octave = octave
                this.notesInt[newData.pitch] = newData
                if (newKey === 'G9') { break }
            }
            ++octave
        }

        return this.notesInt
    }

    /**
     * Return the next piano key in the PianoKey enum and sets the correct midi value   * 
     * @param note
     * @param next wheter to return previous or next key
     */
    protected nextPianoKey(note: INoteData, next: boolean = true) {
        const sign = next ? 1 : -1
        let newNote = note.key + sign
        /**
         * Typescript apparently doesnt have this function
         */
        if (typeof PianoKey[newNote] === 'undefined') {
            if (next) {
                newNote = Number(PianoKey.C)
            } else {
                newNote = Number(PianoKey.B)
            }
        }
        /** Note key is used by the the svg keyboard */
        note.key = newNote
        /** Noteval is used to calculate the midi value */
        note.noteVal += sign
        return note
    }

    /**
     * Applies the key signature alterations to match the corresponding piano key
     * @param signature 
     * @param noteData 
     */
    protected applyKeySignature(signature: KeySignaturesIndex, noteData: INoteDataObject) {
        const modPentagramNotes: Pen[] = []
        const signatureData = KeySignaturesData[signature]
        const sigData = KeySignaturesData[signature]

        for (const sigNote of signatureData.alterations) {
            modPentagramNotes.push(noteData[sigNote].penNote)
        }
        for (const e in noteData) {
            if (noteData[e]) {
                for (const k in modPentagramNotes) {
                    if (noteData[e].penNote === modPentagramNotes[k]) {
                        noteData[e] = this.nextPianoKey(noteData[e],
                            sigData.type === KeySignatureType.SHARPS)
                    }
                }
            }
        }
    }
} 
