import { useMessages } from 'components/hooks';
import Icons from 'components/icons';
import { formatNumber } from 'lib/format';
import { useContext } from 'react';
import {
  Button,
  Form,
  FormButtons,
  FormRow,
  Icon,
  Popup,
  PopupTrigger,
  SubmitButton,
} from 'react-basics';
import BaseParameters from '../[reportId]/BaseParameters';
import ParameterList from '../[reportId]/ParameterList';
import PopupForm from '../[reportId]/PopupForm';
import { ReportContext } from '../[reportId]/Report';
import GoalsAddForm from './GoalsAddForm';
import styles from './GoalsParameters.module.css';

export function GoalsParameters() {
  const { report, runReport, updateReport, isRunning } = useContext(ReportContext);
  const { formatMessage, labels } = useMessages();

  const { id, parameters } = report || {};
  const { websiteId, dateRange, goals } = parameters || {};
  const queryDisabled = !websiteId || !dateRange || goals?.length < 1;

  const handleSubmit = (data: any, e: any) => {
    e.stopPropagation();
    e.preventDefault();

    if (!queryDisabled) {
      runReport(data);
    }
  };

  const handleAddGoals = (goal: { type: string; value: string }) => {
    updateReport({ parameters: { goals: parameters.goals.concat(goal) } });
  };

  const handleUpdateGoals = (
    close: () => void,
    index: number,
    goal: { type: string; value: string },
  ) => {
    const goals = [...parameters.goals];
    goals[index] = goal;
    updateReport({ parameters: { goals } });
    close();
  };

  const handleRemoveGoals = (index: number) => {
    const goals = [...parameters.goals];
    delete goals[index];
    updateReport({ parameters: { goals: goals.filter(n => n) } });
  };

  const AddGoalsButton = () => {
    return (
      <PopupTrigger>
        <Button>
          <Icon>
            <Icons.Plus />
          </Icon>
        </Button>
        <Popup alignment="start">
          <PopupForm>
            <GoalsAddForm onChange={handleAddGoals} />
          </PopupForm>
        </Popup>
      </PopupTrigger>
    );
  };

  return (
    <Form values={parameters} onSubmit={handleSubmit} preventSubmit={true}>
      <BaseParameters allowWebsiteSelect={!id} />
      <FormRow label={formatMessage(labels.goals)} action={<AddGoalsButton />}>
        <ParameterList>
          {goals.map((goal: { type: string; value: string; goal: number }, index: number) => {
            return (
              <PopupTrigger key={index}>
                <ParameterList.Item
                  className={styles.item}
                  onRemove={() => handleRemoveGoals(index)}
                >
                  <div className={styles.value}>
                    <div className={styles.type}>
                      <Icon>{goal.type === 'url' ? <Icons.Eye /> : <Icons.Bolt />}</Icon>
                    </div>
                    <div>{goal.value}</div>
                    <div className={styles.goal}>{formatNumber(goal.goal)}</div>
                  </div>
                </ParameterList.Item>
                <Popup alignment="start">
                  {(close: () => void) => (
                    <PopupForm>
                      <GoalsAddForm
                        type={goal.type}
                        value={goal.value}
                        goal={goal.goal}
                        onChange={handleUpdateGoals.bind(null, close, index)}
                      />
                    </PopupForm>
                  )}
                </Popup>
              </PopupTrigger>
            );
          })}
        </ParameterList>
      </FormRow>
      <FormButtons>
        <SubmitButton variant="primary" disabled={queryDisabled} isLoading={isRunning}>
          {formatMessage(labels.runQuery)}
        </SubmitButton>
      </FormButtons>
    </Form>
  );
}

export default GoalsParameters;
