export default (App) => {
    return {
        'add': function (event, test) {
            console.log('button disabled', this.htmlType, event, test);
        }
    }
}