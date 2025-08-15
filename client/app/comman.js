
export const BaseURL = () => {
    try {
        
        let url = 'http://3.108.254.144:5000'
        // let url = 'http://localhost:5000' // local
        return url
        
    } catch (err) {
 console.log('err',err);
        
    }
}