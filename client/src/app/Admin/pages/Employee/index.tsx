import React from 'react'
import {
  Breadcrumbs,
  IBreadcrumbProps,
  Breadcrumb,
  ButtonGroup,
  Button,
  Dialog,
  Card,
  Icon,
  Tag,
  Spinner
} from '@blueprintjs/core'
import Main from '~/components/Main'
import Loading from '~/components/Loading'
import api from '~/utils/api'
import { RouteComponentProps } from 'react-router'
import styles from './Employee.css'
import EditEmployee from './EditEmployee'
import { showConfirm } from '~/components/GlobalAlert'
import Assign from './Assign'

interface State {
  isAssigning: boolean
  isEditingEmployee: boolean
  isLoading: boolean
  info?: Employee
  reviews: Review[]
}

export default class EmployeePage extends React.PureComponent<
  RouteComponentProps<{ id: string }>,
  State
> {
  state: State = {
    isAssigning: false,
    isEditingEmployee: false,
    isLoading: true,
    reviews: []
  }

  renderCurrentBreadcrumb = ({ text, ...restProps }: IBreadcrumbProps) => {
    return <Breadcrumb {...restProps}>{text}</Breadcrumb>
  }

  async componentDidMount() {
    const { id } = this.props.match.params
    const [err1, info] = await api.get('admin', `/employee/${id}`)
    const [err2, reviews] = await api.get('admin', `/employee/${id}/reviews`)
    if (!err1 && !err2) {
      this.setState({
        info,
        reviews,
        isLoading: false
      })
    }
  }

  showEditEmployDialog = (e: React.MouseEvent) => {
    this.setState({
      isEditingEmployee: true
    })
  }

  showAssignDialog = (e: React.MouseEvent) => {
    this.setState({
      isAssigning: true
    })
  }

  hideEditEmployeeDialog = (e?: React.SyntheticEvent<HTMLElement, Event>) => {
    this.setState({
      isEditingEmployee: false
    })
  }

  hideAssignDialog = (e?: React.SyntheticEvent<HTMLElement, Event>) => {
    this.setState({
      isAssigning: false
    })
  }

  onSavedEmployee = (employee: Employee) => {
    this.hideEditEmployeeDialog()
    this.setState({
      info: employee
    })
  }

  delete = async () => {
    const [err] = await api.delete(
      'admin',
      `/employee/${this.props.match.params.id}`
    )
    if (!err) {
      this.props.history.replace('/')
    }
  }

  confirmDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    showConfirm({
      message: 'Are you sure to delete this employee?',
      onConfirm: this.delete
    })
  }

  onSavedAssign = (review: Review) => {
    this.hideAssignDialog()
    this.setState({
      reviews: this.state.reviews.concat(review)
    })
  }

  deleteReview = (review: Review) => {
    showConfirm({
      message: 'Are you sure to unassign this?',
      onConfirm: async () => {
        const [err] = await api.delete('admin', `/review/${review.id}`)
        if (!err) {
          const reviews = this.state.reviews.filter(item => item !== review)
          this.setState({
            reviews
          })
        }
      }
    })
  }

  render() {
    const {
      isLoading,
      info,
      isEditingEmployee,
      isAssigning,
      reviews
    } = this.state
    return (
      <Main>
        <Loading isLoading={isLoading}>
          {() => (
            <div>
              <div className={styles.title}>
                <Breadcrumbs
                  currentBreadcrumbRenderer={this.renderCurrentBreadcrumb}
                  items={[
                    {
                      href: '#/',
                      text: 'All Employees'
                    },
                    {
                      text: `${info!.name}(${info!.employee_id})`
                    }
                  ]}
                />
                <ButtonGroup minimal>
                  <Button icon="edit" onClick={this.showEditEmployDialog}>
                    Edit
                  </Button>
                  <Button
                    icon="delete"
                    intent="danger"
                    onClick={this.confirmDelete}
                  >
                    Delete
                  </Button>
                </ButtonGroup>
              </div>

              <div className={styles.reviews}>
                <p>Reviews</p>
                <ButtonGroup>
                  <Button icon="share" onClick={this.showAssignDialog}>
                    Add Assign
                  </Button>
                  <Button icon="annotation">Your Review</Button>
                </ButtonGroup>

                <div className={styles.reviewList}>
                  {reviews.map(review => (
                    <Card
                      interactive
                      key={review.id}
                      className={styles.reviewCard}
                    >
                      <p className={styles.reviewCardHead}>
                        <Icon icon="user" />
                        <span className={styles.reviewerName}>
                          {review.reviewer.name}
                        </span>
                        <div className={styles.badge}>
                          <Spinner size={12}></Spinner>
                          <span className={styles.label}>waiting</span>
                        </div>
                        <Button
                          icon="delete"
                          minimal
                          intent="danger"
                          className={styles.delete}
                          onClick={() => this.deleteReview(review)}
                        >
                          unassign
                        </Button>
                      </p>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Loading>
        <Dialog
          title="Edit employee"
          isOpen={isEditingEmployee}
          onClose={this.hideEditEmployeeDialog}
        >
          <EditEmployee onSaved={this.onSavedEmployee} employee={info!} />
        </Dialog>

        <Dialog
          title="Add Review Assign"
          isOpen={isAssigning}
          onClose={this.hideAssignDialog}
        >
          <Assign
            onSaved={this.onSavedAssign}
            reviewers={new Set(reviews.map(review => review.reviewer.id))}
            reviewee={info!}
          />
        </Dialog>
      </Main>
    )
  }
}
