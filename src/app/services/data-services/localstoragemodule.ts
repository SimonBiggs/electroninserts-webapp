/**
 * Check if localStorage is supported                       const isSupported: boolean
 * Check if localStorage has an Item                        function hasItem(key: string): boolean
 * Get the amount of space left in localStorage             function getRemainingSpace(): number
 * Get the maximum amount of space in localStorage          function getMaximumSpace(): number
 * Get the used space in localStorage                       function getUsedSpace(): number
 * Get the used space of an item in localStorage            function getItemUsedSpace(): number
 * Backup Assosiative Array                                 interface Backup
 * Get a Backup of localStorage                             function getBackup(): Backup
 * Apply a Backup to localStorage                           function applyBackup(backup: Backup, fClear: boolean = true, fOverwriteExisting: boolean = true)
 * Dump all information of localStorage in the console      function consoleInfo(fShowMaximumSize: boolean = false)
 */
export module LocalStorage {
    // Copied from https://gist.github.com/CodeiSir/1fb8bd9154dfde7eb0c7
    // found from http://stackoverflow.com/a/34245594
    
    /**
     * Flag set true if the Browser supports localStorage, widthout affecting it
     */
    export const isSupported: boolean = (() => {
        try {
            let itemBackup = localStorage.getItem("")
            localStorage.removeItem("");
            localStorage.setItem("", itemBackup);
            if (itemBackup === null) localStorage.removeItem("")
            else localStorage.setItem("", itemBackup)
            return true;
        } catch (e) {
            return false;
        }
    })()

    /**
     * Check if localStorage has an Item / exists with the give key
     * @param key the key of the Item
     */
    export function hasItem(key: string): boolean {
        return localStorage.getItem(key) !== null
    }

    /**
     * This will return the left space in localStorage without affecting it's content
     * Might be slow !!!
     */
    export function getRemainingSpace(): number {
        let itemBackup = localStorage.getItem("")
        let increase = true
        let data = "1"
        let totalData = ""
        let trytotalData = ""
        while (true) {
            try {
                trytotalData = totalData + data
                localStorage.setItem("", trytotalData);
                totalData = trytotalData;
                if (increase) data += data
            } catch (e) {
                if (data.length < 2) {
                    break;
                }
                increase = false
                data = data.substr(data.length / 2)
            }
        }
        if (itemBackup === null) localStorage.removeItem("")
        else localStorage.setItem("", itemBackup)

        return totalData.length
    }

    /**
     * This function returns the maximum size of localStorage without affecting it's content
     * Might be slow !!!
     */
    export function getMaximumSpace(): number {
        let backup = getBackup()
        localStorage.clear()
        let max = getRemainingSpace()
        applyBackup(backup)
        return max
    }

    /**
     * This will return the currently used size of localStorage
     */
    export function getUsedSpace(): number {
        let sum = 0

        for (let i = 0; i < localStorage.length; ++i) {
            let key = localStorage.key(i)
            let value = localStorage.getItem(key)
            sum += key.length + value.length
        }

        return sum
    }

    /**
     * This will return the currently used size of a given Item, returns NaN if key is not found
     * @param key
     */
    export function getItemUsedSpace(key: string): number {
        let value = localStorage.getItem(key)
        if (value === null) {
            return NaN
        } else {
            return key.length + value.length
        }
    }

    /** 
     * Associative-array for localStorage holding key->value 
     */
    export interface Backup {
        [index: string]: string
    }

    /**
     * This will return a localStorage-backup (Associative-Array key->value)
     */
    export function getBackup(): Backup {
        let backup: Backup = {}

        for (let i = 0; i < localStorage.length; ++i) {
            let key = localStorage.key(i)
            let value = localStorage.getItem(key)
            backup[key] = value
        }

        return backup
    }

    /**
     * This will apply a localStorage-Backup (Associative-Array key->value)
     * @param backup            associative-array 
     * @param fClear             optional flag to clear all existing storage first. Default: true
     * @param fOverwriteExisting optional flag to replace existing keys. Default: true
     */
    export function applyBackup(backup: Backup, fClear: boolean = true, fOverwriteExisting: boolean = true) {
        if (fClear == true) {
            localStorage.clear()
        }

        for (let key in backup) {
            if (fOverwriteExisting === false && backup[key] !== undefined) {
                continue
            }
            let value = backup[key]
            localStorage.setItem(key, value)
        }
    }

    /**
     * This functions dumps all keys and values of the local Storage to the console,
     * as well as the current size and number of items
     * @param fShowMaximumSize optional, flag show maximum size of localStorage. Default: false
     */
    export function consoleInfo(fShowMaximumSize: boolean = false) {
        let amount = 0
        let size = 0

        for (let i = 0; i < localStorage.length; ++i) {
            let key = localStorage.key(i)
            let value = localStorage.getItem(key);
            console.log(amount, key, value)
            size += key.length + value.length
            amount++
        }
        console.log("Total entries:", amount)
        console.log("Total size:", size)
        if (fShowMaximumSize === true) {
            let maxSize = getMaximumSpace()
            console.log("Total size:", maxSize)
        }
    }
}
/*
    // Example
    console.log("LocalStorage supported:", LocalStorage.isSupported)// true - I hope so anyways 😉
    localStorage.setItem("asd", "ASDASD")                           // sets / overwrites the item "asd"
    localStorage.setItem("asd" + Math.random(), "ASDASD")           // set another item each time you refresh the page
    var backup = LocalStorage.getBackup()                           // creates a backup, we will need it later!
    console.log(JSON.stringify(backup))                             // this is how the backup looks like
    var usedSpace = LocalStorage.getUsedSpace()                     // amount of space used right now
    console.log("Used Space:", usedSpace)                
    var maxSpace = LocalStorage.getMaximumSpace()                   // amount of maximum space aviable
    console.log("Maximum Space:", maxSpace)             
    var remSpace = LocalStorage.getRemainingSpace()                 // amount of remaining space
    console.log("Remaining Space:", remSpace)
    console.log("SpaceCheck", maxSpace === usedSpace + remSpace)    // true
    console.log("hasItem", LocalStorage.hasItem("nothis0ne"))       // we don't have this one in our localStorage
    localStorage.clear()                                            // oops, we deleted the localStorage!
    console.log("has asd",LocalStorage.hasItem("asd"))              // item asd is lost 😒
    LocalStorage.applyBackup(backup)                                // but we have a backup, restore it!
    LocalStorage.consoleInfo()                                      // show all the info we have, see the backup worked 😊
*/