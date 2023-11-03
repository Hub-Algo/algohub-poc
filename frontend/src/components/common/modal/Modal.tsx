import { BiX } from 'react-icons/bi'
import Button from '../button/Button'

interface ModalProps {
  id: string
  children: React.ReactNode
  modalButtonName: React.ReactNode
}

function Modal({ id, children, modalButtonName }: ModalProps) {
  return (
    <>
      <Button buttonType={'outline'} size={'lg'} onClick={handleOpenModal}>
        {modalButtonName}
      </Button>

      <dialog id={id} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <div className="modal-action mt-0">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <Button buttonColor={'neutral'}>{<BiX />}</Button>
            </form>
          </div>

          {children}
        </div>
      </dialog>
    </>
  )

  function handleOpenModal() {
    const modalElement = document.getElementById(id) as HTMLDialogElement

    if (modalElement) {
      modalElement.showModal()
    }
  }
}

export default Modal
