import {useEffect,useState} from 'react'

export const useToast = () => {
    const [errors, setErrors] = useState("");
    const [openToast, setOpenToast] = useState(false);
    useEffect(() => {
        if (errors) {
          setOpenToast(true);
        }
        const timer = setTimeout(() => {
          setOpenToast(false);
          setErrors("");
        }, 3000);
        return () => {
          clearTimeout(timer);
        };
      }, [errors]);
    return { errors, setErrors, openToast };
}
