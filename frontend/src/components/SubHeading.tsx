type subHeadingProps = {
    label: string;
}

export function SubHeading({label}: subHeadingProps){
    return(
        <div className="font-bold text-4xm pt-4">

        {label}
        </div>
    )
}