type BottomWarningProps = {
    label: string;
    buttonText: string;
    to: string
}

export function BottomWarning({label , buttonText , to}: BottomWarningProps){
    return(
        <div>
            {label}
        </div>
    )
}