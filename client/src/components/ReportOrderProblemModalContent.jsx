import "./styles/ReportOrderProblemModalContent.css";
import { useForm } from "react-hook-form";
import { REQUIRED_TEXTAREA_OPTIONS } from "../utils/inputOptionsConsts";
import UIButton from "./UI/uiButton/UIButton";
import FilePickerSection from "./UI/filePicker/FilePickerSection";
import { useContext, useState } from "react";
import { v4 } from "uuid";
import FileActions from "../utils/FileActions";
import { createOrderProblem, getOrderProblemByUserAndOrderId } from "../http/OrderProblemsAPI";
import { Context } from "../Context";
import { observer } from "mobx-react-lite";
import setErrorModalVisibility from "../utils/setErrorModalVisibility";
import ReactHookFormTextarea from "./UI/reactHookFormTextarea/ReactHookFormTextarea";

const ReportOrderProblemModalContent = observer(({ closeModal }) => {
  const { app, user } = useContext(Context);
  const [files, setFiles] = useState([]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    mode: "onBlur"
  });

  async function onSubmit(formFields) {
    if (areErrors) return;
    try {
      const existingOrderProblem = await getOrderProblemByUserAndOrderId(user.user.id, app.reportOrderProblemOrderId)

      if (Array.isArray(existingOrderProblem) ? existingOrderProblem.length > 0 : existingOrderProblem) {
        const errorModalInfoChildren = (
          <p className="error-modal-p">
            You have already sent the problem. Wait for the response.
          </p>
        );

        app.setErrorModalBtnRef(app.reportOrderProblemBtnRef);
        app.setErrorModalInfo({
          children: errorModalInfoChildren,
          id: "report-order-problem-already-sent-submit-error",
          className: ""
        });
        
        closeModal();
        setErrorModalVisibility(true, app);
        return;
      }

      const id = v4();
      const date = new Date().toISOString();

      const transformedFiles = await Promise.all(
        files.map(file => FileActions.getBase64(file.fileObj))
      );

      const filesToSend = files.map((file, index) => ({ ...file, fileObj: transformedFiles[index] }));

      const orderProblem = {
        id,
        userId: user.user.id,
        orderId: app.reportOrderProblemOrderId,
        date,
        problem: formFields.problem,
        images: filesToSend,
      };

      await createOrderProblem(orderProblem);
      closeModal();
    } catch (e) {
      console.log(e.message);
      const errorModalInfoChildren = (
        <p className="error-modal-p">
          Something has gone wrong while sending the problem. Try a bit later.
        </p>
      );

      app.setErrorModalInfo({ children: errorModalInfoChildren, id: "report-order-problem-submit-error", className: "" });
      app.setErrorModalBtnRef(app.reportOrderProblemBtnRef);

      closeModal();
      setErrorModalVisibility(true, app);
    }
  }

  const problemTextareaName = "problem";
  const problemRegisterResult = register(problemTextareaName, REQUIRED_TEXTAREA_OPTIONS);

  const areErrors = !!Object.keys(errors).length;

  return (
    <form
      className="report-order-problem-modal-content"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="report-order-problem-modal-content-inputs">
        <ReactHookFormTextarea 
          labelText="Problem"
          textareaName={problemTextareaName}
          errors={errors}
          registerFnResult={problemRegisterResult}
        />
        <FilePickerSection files={files} setFiles={setFiles} />
      </div>
      <div className="report-order-problem-modal-btn-group">
        <UIButton variant="modal-deny" onClick={closeModal}>
          Deny
        </UIButton>
        <UIButton variant="modal-submit" type="submit" disabled={areErrors}>
          Submit
        </UIButton>
      </div>
    </form>
  );
});

export default ReportOrderProblemModalContent;
