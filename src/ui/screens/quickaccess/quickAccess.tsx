import { ScrollScreen } from "@ui/components/scrollScreen";
import { useI18n } from "@ui/i18n";
import { colors } from "@ui/styles/colors";
import React, { useState, useEffect } from "react";
import styled from "styled-components/native";
import LinearGradient from "react-native-linear-gradient";
import { StyleSheet, View } from "react-native";
import { DraxProvider, DraxView } from "react-native-drax";
import { useServices } from "@core/services";
import { I_Active } from "@domain/quickaccess/quickAccess";

export const QuickAccess: React.FC = () => {
	const { format } = useI18n();
	const _quickAccess = [
		{
			title: format("quickaccess.sleeptitle"),
			desc: format("quickaccess.sleepdesc"),
			id: "sleep",
		},
		{
			title: format("quickaccess.alarmtitle"),
			desc: format("quickaccess.alarmdesc"),
			id: "alarm",
		},
		{
			title: format("quickaccess.calendartitle"),
			desc: format("quickaccess.calendardesc"),
			id: "calendar",
		},
	];

	const _disabledQuickAccess = [
		{
			title: format("quickaccess.timertitle"),
			desc: format("quickaccess.timerdesc"),
			id: "timer",
		},
	];

	const [dragged, setDragged] = useState(-1);
	const [disabledDragged, setDisabledDragged] = useState(-1);

	const [receiver, setReceiver] = useState(-1);
	const [disabledReceiver, setDisabledReceiver] = useState(-1);
	const [quickAccess, setQuickAccess] = useState<I_Active[]>(_quickAccess);
	const [disabledQuickAccess, setDisabledQuickAccess] = useState<I_Active[]>(_disabledQuickAccess);
	const { userQuickAccessService } = useServices();

	useEffect(() => {
		if (
			userQuickAccessService.quickaccess.get().active.length ||
			userQuickAccessService.quickaccess.get().disabled.length
		) {
			console.log(
				"## INITIAL RUN",
				userQuickAccessService.quickaccess.get()?.active.map((t) => t.id)
			);
			setQuickAccess(userQuickAccessService.quickaccess.get()?.active);
			setDisabledQuickAccess(userQuickAccessService.quickaccess.get()?.disabled);
		}
	}, []);

	return (
		<Container>
			<DraxProvider>
				<Description>{format("quickaccess.description")}</Description>
				<Label>{format("quickaccess.displayed")}</Label>
				{quickAccess.length === 0 && (
					<DraxView
						style={{ height: 110 }}
						onReceiveDragEnter={() => {
							setReceiver(-1);
						}}
						onReceiveDragExit={() => {
							setReceiver(-1);
						}}
						onReceiveDragDrop={({ dragged: { payload } }) => {
							userQuickAccessService.update({
								active: [disabledQuickAccess[payload.i]],
								disabled: disabledQuickAccess.filter((t) => t.id != payload.tile.id),
							});
							setQuickAccess([disabledQuickAccess[payload.i]]);
							setDisabledQuickAccess(disabledQuickAccess.filter((t) => t.id != payload.tile.id));
							setDragged(-1);
							setDisabledDragged(-1);
						}}
					/>
				)}
				{quickAccess.map((tile, i) => {
					return (
						<>
							{(0 == i && dragged !== -1 && dragged != i) || (disabledDragged !== -1 && i == 0) ? ( // FIRST RECEIVER
								<DraxView
									style={receiver === i ? styles.receiverfocus : styles.receiver}
									onReceiveDragEnter={() => {
										setReceiver(i);
									}}
									onReceiveDragExit={() => {
										setReceiver(-1);
									}}
									onReceiveDragDrop={({ dragged: { payload } }) => {
										const isInQuickAccess = quickAccess.findIndex((el) => el.id === payload.tile.id) !== -1;

										if (isInQuickAccess) {
											const newArrayWithoutTile = quickAccess.filter((t) => t.id != payload.tile.id);
											const newBeginning = newArrayWithoutTile.slice(0, i);
											const newEnd = newArrayWithoutTile.slice(i, quickAccess.length);
											userQuickAccessService.update({
												active: [...newBeginning, quickAccess[payload.i], ...newEnd],
												disabled: disabledQuickAccess,
											});
											setQuickAccess([...newBeginning, quickAccess[payload.i], ...newEnd]);
										} else {
											const newBeginning = quickAccess.slice(0, i);
											const newEnd = quickAccess.slice(i, disabledQuickAccess.length);
											userQuickAccessService.update({
												active: [...newBeginning, disabledQuickAccess[payload.i], ...newEnd],
												disabled: disabledQuickAccess.filter((t) => t.id != payload.tile.id),
											});
											setQuickAccess([...newBeginning, disabledQuickAccess[payload.i], ...newEnd]);
											setDisabledQuickAccess(disabledQuickAccess.filter((t) => t.id != payload.tile.id));
										}
										setDragged(-1);
										setDisabledDragged(-1);
									}}
								/>
							) : i == 0 ? (
								<View style={styles.receiver}></View>
							) : null}
							<DraxView
								key={i}
								onDragStart={() => {
									setDragged(i);
									setReceiver(-1);
									setDisabledReceiver(-1);
									console.log("CIR-275 start drag", i);
								}}
								onDragEnd={() => {
									console.log("CIR-275 OnDragEnd");
									setDragged(-1);
								}}
								onDragExit={() => {
									console.log("CIR-275 OnDragExit");
									setReceiver(-1);
								}}
								payload={{ tile, i }}
								animateSnapback={false}
							>
								<QuickAccessContainer key={i} colors={colors.gradient.orange.slice(0)}>
									<InnerContainer>
										<Draggable source={require("@assets/images/group.png")}></Draggable>
										<RightContainer>
											<Title>{tile.title}</Title>
											<TileDesc>{tile.desc}</TileDesc>
										</RightContainer>
									</InnerContainer>
								</QuickAccessContainer>
							</DraxView>
							{(dragged !== -1 && dragged != i && dragged != i + 1) || disabledDragged !== -1 ? ( // SECOND REICEVIER
								<DraxView
									style={receiver === i + 1 ? styles.receiverfocus : styles.receiver}
									onReceiveDragEnter={({ dragged: { payload } }) => {
										console.log(`CIR-275  OnDragENterReceive ${payload}`);
										setReceiver(i + 1);
									}}
									onReceiveDragExit={({ dragged: { payload } }) => {
										console.log(`CIR-275  DragExitReceive ${payload}`);
										setReceiver(-1);
									}}
									onReceiveDragDrop={({ dragged: { payload } }) => {
										const isInQuickAccess = quickAccess.findIndex((el) => el.id === payload.tile.id) !== -1;

										if (isInQuickAccess) {
											const newArrayWithoutTile = quickAccess.filter((t) => t.id != payload.tile.id);
											const newBeginning = newArrayWithoutTile.slice(0, i + 1);
											const newEnd = newArrayWithoutTile.slice(i + 1, quickAccess.length);
											userQuickAccessService.update({
												active: [...newBeginning, quickAccess[payload.i], ...newEnd],
												disabled: disabledQuickAccess,
											});
											setQuickAccess([...newBeginning, quickAccess[payload.i], ...newEnd]);
										} else {
											const newBeginning = quickAccess.slice(0, i + 1);
											const newEnd = quickAccess.slice(i + 1, disabledQuickAccess.length);
											userQuickAccessService.update({
												active: [...newBeginning, disabledQuickAccess[payload.i], ...newEnd],
												disabled: disabledQuickAccess.filter((t) => t.id != payload.tile.id),
											});
											setQuickAccess([...newBeginning, disabledQuickAccess[payload.i], ...newEnd]);
											setDisabledQuickAccess(disabledQuickAccess.filter((t) => t.id != payload.tile.id));
										}

										setDragged(-1);
										setDisabledDragged(-1);
									}}
								/>
							) : (
								<View style={styles.receiver}></View>
							)}
						</>
					);
				})}
				<Label>{format("quickaccess.hidden")}</Label>
				{disabledQuickAccess.map((tile, i) => {
					return (
						<>
							{(disabledDragged !== -1 && disabledDragged != i + 1 && disabledDragged != i) || // THIRD REICEIVER
								(dragged !== -1 && i == 0 ? (
									<DraxView
										style={disabledReceiver === i ? styles.receiverfocus : styles.receiver}
										onReceiveDragEnter={({ dragged: { payload } }) => {
											console.log(`CIR-275  OnDragENterReceive ${payload}`);
											setDisabledReceiver(i);
										}}
										onReceiveDragExit={({ dragged: { payload } }) => {
											console.log(`CIR-275  DragExitReceive ${payload}`);
											setDisabledReceiver(-1);
											setReceiver(-1);
										}}
										onReceiveDragDrop={({ dragged: { payload } }) => {
											const isInQuickAccess = quickAccess.findIndex((el) => el.id === payload.tile.id) !== -1;

											if (isInQuickAccess) {
												const newBeginning = disabledQuickAccess.slice(0, i);
												const newEnd = disabledQuickAccess.slice(i, disabledQuickAccess.length);
												userQuickAccessService.update({
													active: quickAccess.filter((t) => t.id != payload.tile.id),
													disabled: [...newBeginning, quickAccess[payload.i], ...newEnd],
												});
												console.log(
													"CIR-402 newBeginning : ",
													newBeginning.map((i) => i.title),
													"            New elem :",
													quickAccess[payload.i].id,
													"       newEnd :",
													newEnd.map((i) => i.title)
												);
												setDisabledQuickAccess([...newBeginning, quickAccess[payload.i], ...newEnd]);
												setQuickAccess(quickAccess.filter((t) => t.id != payload.tile.id));
											} else {
												const newBeginning = disabledQuickAccess.slice(0, i);
												const newEnd = disabledQuickAccess.slice(i, disabledQuickAccess.length);
												userQuickAccessService.update({
													active: quickAccess,
													disabled: [...newBeginning, disabledQuickAccess[payload.i], ...newEnd],
												});
												setDisabledQuickAccess([...newBeginning, disabledQuickAccess[payload.i], ...newEnd]);
											}
											setDragged(-1);
										}}
									/>
								) : i === 0 ? (
									<View style={styles.receiver}></View>
								) : null)}
							<DraxView
								key={i}
								onDragStart={() => {
									setDisabledDragged(i);
									setDisabledReceiver(-1);
									setReceiver(-1);
								}}
								onDragEnd={() => {
									console.log("CIR-275 OnDragEnd");
									setDragged(-1);
									setDisabledDragged(-1);
								}}
								payload={{ tile, i }}
								animateSnapback={false}
								draggable={disabledQuickAccess.length > 1}
							>
								<View style={styles.shadow}>
									<DisabledQuickAccessContainer key={i}>
										<InnerContainer>
											<Draggable source={require("@assets/images/groupblack.png")}></Draggable>
											<DisabledRightContainer>
												<DisabledTitle>{tile.title}</DisabledTitle>
												<DisabledTileDesc>{tile.desc}</DisabledTileDesc>
											</DisabledRightContainer>
										</InnerContainer>
									</DisabledQuickAccessContainer>
								</View>
							</DraxView>
							{(disabledDragged !== -1 && disabledDragged != i && disabledDragged != i + 1) || dragged != -1 ? (
								<DraxView
									style={disabledReceiver === i + 1 ? styles.receiverfocus : styles.receiver}
									onReceiveDragEnter={({ dragged: { payload } }) => {
										console.log(`CIR-275  OnDragENterReceive ${payload}`);
										setDisabledReceiver(i + 1);
									}}
									onReceiveDragExit={({ dragged: { payload } }) => {
										console.log(`CIR-275  DragExitReceive ${payload}`);
										setDisabledReceiver(-1);
										setReceiver(-1);
									}}
									onReceiveDragDrop={({ dragged: { payload } }) => {
										console.log(`CIR-275  received ${payload}`);

										const isInQuickAccess = quickAccess.findIndex((el) => el.id === payload.tile.id) !== -1;
										if (isInQuickAccess) {
											const newBeginning = disabledQuickAccess.slice(0, i + 1);
											const newEnd = disabledQuickAccess.slice(i + 1, disabledQuickAccess.length);
											console.log(
												"CIR-402 newBeginning : ",
												newBeginning.map((i) => i.title),
												"            New elem :",
												quickAccess[payload.i].id,
												"       newEnd :",
												newEnd.map((i) => i.title)
											);
											setDisabledQuickAccess([...newBeginning, quickAccess[payload.i], ...newEnd]);
											setQuickAccess(quickAccess.filter((t) => t.id != payload.tile.id));
											userQuickAccessService.update({
												active: quickAccess.filter((t) => t.id != payload.tile.id),
												disabled: [...newBeginning, disabledQuickAccess[payload.i], ...newEnd],
											});
										} else {
											const newArrayWithoutTile = disabledQuickAccess.filter((t) => t.id != payload.tile.id);
											const newBeginning = newArrayWithoutTile.slice(0, i);
											const newEnd = newArrayWithoutTile.slice(i, disabledQuickAccess.length);
											userQuickAccessService.update({
												active: quickAccess,
												disabled: [...newBeginning, disabledQuickAccess[payload.i], ...newEnd],
											});
											setDisabledQuickAccess([...newBeginning, disabledQuickAccess[payload.i], ...newEnd]);
										}
										setDragged(-1);
										setDisabledDragged(-1);
									}}
								/>
							) : (
								<View style={styles.receiver}></View>
							)}
						</>
					);
				})}
			</DraxProvider>
		</Container>
	);
};

const styles = StyleSheet.create({
	shadow: {
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 7,
		},
		shadowOpacity: 0.43,
		shadowRadius: 9.51,
		elevation: 15,
	},
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	draggable: {
		width: "100%",
		height: 100,
		backgroundColor: "blue",
	},
	receiver: {
		width: "100%",
		height: 15,
		borderRadius: 8,
	},
	receiverfocus: {
		width: "100%",
		height: 100,
		borderRadius: 8,
	},
});

const Title = styled.Text`
	font-size: 18px;
	color: white;
	font-weight: 500;
	margin-vertical: 4;
`;

const DisabledTitle = styled.Text`
	font-size: 18px;
	color: black;
	font-weight: 500;
	margin-vertical: 4;
`;

const TileDesc = styled.Text`
	color: white;
`;

const DisabledTileDesc = styled.Text`
	color: ${colors.gray};
`;

const DisabledRightContainer = styled.View`
	flex: 1;
	border-left-width: 1;
	border-left-color: ${colors.gray};
	margin-vertical: 8;
	padding-left: 10;
`;

const RightContainer = styled.View`
	flex: 1;
	border-left-width: 1;
	border-left-color: white;
	margin-vertical: 8;
	padding-left: 10;
`;

const InnerContainer = styled.View`
	display: flex;
	flex-direction: row;
`;

const Draggable = styled.Image`
	height: 40px;
	margin-vertical: 22;
`;

const Label = styled.Text`
	font-size: 18px;
	margin-vertical: 14;
`;

const Description = styled.Text`
	font-size: 18px;
	color: ${colors.textSecondary};
	font-weight: 500;
	padding-bottom: 20;
	padding-top: 10;
	border-bottom-width: 0.5;
	border-bottom-color: ${colors.gray};
`;

const QuickAccessContainer = styled(LinearGradient)`
	height: 84px;
	width: 100%;
	border-radius: 8px;
`;

const DisabledQuickAccessContainer = styled(View)`
	height: 84px;
	width: 100%;
	border-radius: 8px;
	overflow: hidden;
	background-color: white;
	margin: 0;
`;

const Container = styled(ScrollScreen)`
	padding: 24px 24px;
	width: 100%;
`;
