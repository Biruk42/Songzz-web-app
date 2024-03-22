// import React from "react";
// import { useNavigate } from "react-router-dom";

// const CommentBox = ({ userId, userComment, setUserComment, handleComment }) => {
//   const navigate = useNavigate();
//   return (
//     <>
//       <form className="row song-form">
//         <div className="col-12 py-3">
//           <textarea
//             rows="4"
//             value={userComment}
//             onChange={(e) => setUserComment(e.target.value)}
//             className="form-control description"
//           />
//         </div>
//       </form>
//       {!userId ? (
//         <>
//           <h5>Please login or Create an account to post comment</h5>
//           <button className="btn btn-success" onClick={() => navigate("/auth")}>
//             Login
//           </button>
//         </>
//       ) : (
//         <>
//           <button
//             className="btn btn-primary"
//             type="submit"
//             onClick={handleComment}>
//             Post Comment
//           </button>
//         </>
//       )}
//     </>
//   );
// };

// export default CommentBox;
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: lightgray !important;
  resize: vertical;
`;

const CommentBox = ({ userId, userComment, setUserComment, handleComment }) => {
  const navigate = useNavigate();

  return (
    <>
      <form className="row song-form">
        <div className="col-12 py-3">
          <StyledTextarea
            rows="4"
            value={userComment}
            onChange={(e) => setUserComment(e.target.value)}
            className="form-control description"
          />
        </div>
      </form>
      {!userId ? (
        <>
          <h5>Please login or Create an account to post comment</h5>
          <button className="btn btn-success" onClick={() => navigate("/auth")}>
            Login
          </button>
        </>
      ) : (
        <>
          <button
            className="btn btn-primary"
            type="submit"
            onClick={handleComment}>
            Post Comment
          </button>
        </>
      )}
    </>
  );
};

export default CommentBox;
