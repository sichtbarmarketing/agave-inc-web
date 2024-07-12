/**
 * usePosition Hook:
 * - code taken from 'WebDevSimplified' https://www.youtube.com/watch?v=0c6znExIqRw
 * - slightly modified for use with Typescript
 **/

import { useState } from 'react';

export const useToggle = (initialValue: boolean): [boolean, (value?: boolean) => void] => {
    const [value, setValue] = useState(initialValue);

    const toggleValue = (value?: boolean) => {
        setValue((prevState) => value ?? !prevState)
    }

    return [value, toggleValue];
}