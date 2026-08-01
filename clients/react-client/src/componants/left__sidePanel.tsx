import CreateMenu from "./menus/create";
import DeleteMenu from "./menus/delete";

function Left_Aside() {
  return (
    <>
      <p>Left Aside</p>
      <hr></hr>
      <CreateMenu />
      <DeleteMenu />
    </>
  );
}
export default Left_Aside;
