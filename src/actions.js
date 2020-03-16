import axios from "./acios";

export async function fn() {
    const {data} = await axios.get();
}
