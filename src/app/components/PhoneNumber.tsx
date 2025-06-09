const formatPhoneNumber = (phoneNumber: string) => {
    // Assuming we sanitize the phone numbe on input so it is always a 10 digit string
    // also ignoring international codes for toy example
    return phoneNumber.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
}

export const PhoneNumber = ({ phoneNumber }: { phoneNumber: string }) => {
    const formattedPhoneNumber = formatPhoneNumber(phoneNumber);
    return (
        <>
            <a href={`tel:+1${phoneNumber}`} className="phone-number">
                {formattedPhoneNumber}
            </a>
            <style jsx>{`
                .phone-number {
                    color: blue;
                }
                .phone-number:hover {
                    color: darkblue;

            `}</style>
        </>
    )
}