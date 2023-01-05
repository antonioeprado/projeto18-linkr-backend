export default function filterHashtags(text) {
    let toArr = text.split(" ");
    const finalArr = toArr.filter((e) => {
      if (e[0] === "#") {
        return e;
      }
    });
    return finalArr;
  }