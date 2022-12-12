export const getDate = (date) => {
    const _date = new Date(date);
    return `${_date.getMonth()}/${_date.getFullYear()}`;
}